import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';

import { Text, Input, Button, Chip, DateField } from '../../components';
import { LoanInput } from '../../api/echo';
import { Loan, RecordStatus, LOAN_STATUS_LABELS } from '../../types';

interface Props {
  initial?: Loan | null;
  submitting?: boolean;
  onSubmit: (input: LoanInput) => void;
}

export function LoanForm({ initial, submitting, onSubmit }: Props) {
  const [name, setName] = useState('');
  const [lender, setLender] = useState('');
  const [principal, setPrincipal] = useState('');
  const [outstanding, setOutstanding] = useState('');
  const [rate, setRate] = useState('');
  const [emi, setEmi] = useState('');
  const [tenure, setTenure] = useState('');
  const [nextDue, setNextDue] = useState<Date | null>(null);
  const [status, setStatus] = useState<RecordStatus>(RecordStatus.ACTIVE);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initial) return;
    setName(initial.name);
    setLender(initial.lender ?? '');
    setPrincipal(String(initial.principal));
    setOutstanding(String(initial.outstanding));
    setRate(initial.interestRate ? String(initial.interestRate) : '');
    setEmi(initial.emiAmount ? String(initial.emiAmount) : '');
    setTenure(initial.tenureMonths != null ? String(initial.tenureMonths) : '');
    setNextDue(initial.nextDueDate ? new Date(initial.nextDueDate) : null);
    setStatus(initial.status);
    setNotes(initial.notes ?? '');
  }, [initial]);

  const submit = () => {
    setError(null);
    const principalNum = Number(principal);
    const outstandingNum = Number(outstanding);
    const rateNum = rate.trim() === '' ? undefined : Number(rate);
    const emiNum = emi.trim() === '' ? undefined : Number(emi);
    const tenureNum = tenure.trim() === '' ? undefined : Number(tenure);
    if (!name.trim()) return setError('Name is required.');
    if (Number.isNaN(principalNum) || principalNum < 0) return setError('Enter a valid principal.');
    if (Number.isNaN(outstandingNum) || outstandingNum < 0)
      return setError('Enter a valid outstanding amount.');

    onSubmit({
      name: name.trim(),
      lender: lender.trim() || undefined,
      principal: principalNum,
      outstanding: outstandingNum,
      interestRate: rateNum,
      emiAmount: emiNum,
      tenureMonths: tenureNum,
      nextDueDate: nextDue ? nextDue.toISOString() : undefined,
      status,
      notes: notes.trim() || undefined,
    });
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      <View style={{ gap: 14, paddingBottom: 8 }}>
        <Input label="Name" value={name} onChangeText={setName} placeholder="e.g. Home loan" />
        <Input label="Lender" value={lender} onChangeText={setLender} placeholder="e.g. HDFC (optional)" />

        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Input label="Principal" value={principal} onChangeText={setPrincipal} keyboardType="numeric" placeholder="0" />
          </View>
          <View style={{ flex: 1 }}>
            <Input label="Outstanding" value={outstanding} onChangeText={setOutstanding} keyboardType="numeric" placeholder="0" />
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Input label="Interest %" value={rate} onChangeText={setRate} keyboardType="numeric" placeholder="Optional" />
          </View>
          <View style={{ flex: 1 }}>
            <Input label="EMI" value={emi} onChangeText={setEmi} keyboardType="numeric" placeholder="Optional" />
          </View>
          <View style={{ flex: 1 }}>
            <Input label="Tenure (mo)" value={tenure} onChangeText={setTenure} keyboardType="numeric" placeholder="Optional" />
          </View>
        </View>

        <DateField label="Next due date" value={nextDue} onChange={setNextDue} optional />

        <View style={{ gap: 6 }}>
          <Text variant="label" color="textMuted">
            Status
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {Object.values(RecordStatus).map((s) => (
              <Chip key={s} label={LOAN_STATUS_LABELS[s]} selected={status === s} onPress={() => setStatus(s)} />
            ))}
          </View>
        </View>

        <Input label="Notes" value={notes} onChangeText={setNotes} placeholder="Optional" multiline />

        {error ? (
          <Text variant="caption" color="danger">
            {error}
          </Text>
        ) : null}

        <Button title={initial ? 'Save changes' : 'Add loan'} onPress={submit} loading={submitting} style={{ marginTop: 4 }} />
      </View>
    </ScrollView>
  );
}
