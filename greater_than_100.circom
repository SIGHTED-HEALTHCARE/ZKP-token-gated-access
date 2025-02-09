pragma circom 2.0.0;

template GreaterThan(n) {
    signal input value;
    signal output result;

    result <== value > n ? 1 : 0;
}

component main = GreaterThan(100);
