import { useState, useMemo, useCallback } from 'react';
import { fetchPnrDetails } from '../utils/pnrApi';
import { DISPOSITIONS } from '../constants/dispositions';

export const MERCHANT_FEE_RATE = 0.029; // card-processor fee, auto-deducted — adjust to your processor's actual rate

export const emptyBookingForm = {
  firstName: '', middleName: '', lastName: '', dob: '', email: '',
  callingPhone: '', billingPhone: '', billingAddress: '', billingState: '', billingZip: '', billingCountry: '',
  pnr: '', airlineCode: '', airlineName: '', flightNumber: '', fromCity: '', toCity: '', travelDate: '', departureTime: '',
  paxAdults: '1', paxChildren: '0', paxInfants: '0', paxSeniors: '0',
  cardNumber: '', cardExp: '', cardCvv: '',
  reasonOfCharge: DISPOSITIONS[0],
  ticketNumber: '',
  baseFare: '', agencyFee: '',
  remarks: '',
};

export function useBookingForm() {
  const [form, setForm] = useState(emptyBookingForm);
  const [pnrStatus, setPnrStatus] = useState('idle'); // idle | loading | done | error
  const [pnrError, setPnrError] = useState('');

  const set = useCallback((key, val) => setForm(p => ({ ...p, [key]: val })), []);

  const reset = useCallback(() => {
    setForm(emptyBookingForm);
    setPnrStatus('idle');
    setPnrError('');
  }, []);

  const fetchPnr = useCallback(async () => {
    setPnrStatus('loading');
    setPnrError('');
    try {
      const d = await fetchPnrDetails(form.pnr);
      setForm(p => ({ ...p, ...d }));
      setPnrStatus('done');
    } catch (e) {
      setPnrStatus('error');
      setPnrError(e.message);
    }
  }, [form.pnr]);

  const fare = useMemo(() => {
    const base = parseFloat(form.baseFare) || 0;
    const agency = parseFloat(form.agencyFee) || 0;
    const merchant = +((base + agency) * MERCHANT_FEE_RATE).toFixed(2);
    const grand = +(base + agency + merchant).toFixed(2);
    return { base, agency, merchant, grand };
  }, [form.baseFare, form.agencyFee]);

  const paxTotal = (parseInt(form.paxAdults) || 0) + (parseInt(form.paxChildren) || 0)
    + (parseInt(form.paxInfants) || 0) + (parseInt(form.paxSeniors) || 0);

  const isValid = form.firstName && form.lastName && form.callingPhone;

  return { form, set, reset, fetchPnr, pnrStatus, pnrError, fare, paxTotal, isValid };
}

// Never persist a full card number or CVV — only the last 4 digits are kept for reference.
export function buildBookingPayload(form, fare) {
  const { cardNumber, cardCvv, ...rest } = form;
  return {
    ...rest,
    cardLast4: cardNumber ? cardNumber.replace(/\s/g, '').slice(-4) : '',
    baseFare: fare.base.toFixed(2),
    agencyFee: fare.agency.toFixed(2),
    merchantFee: fare.merchant.toFixed(2),
    grandTotal: fare.grand.toFixed(2),
  };
}
