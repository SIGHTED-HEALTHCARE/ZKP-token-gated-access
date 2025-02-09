pragma circom 2.0.0;

template EligibilityCheck(treatmentCode) {
    signal input conditionCode;
    signal output result;

    result <== (conditionCode == treatmentCode) ? 1 : 0;
}

component main = EligibilityCheck(12345); // Treatment code for the specific procedure
