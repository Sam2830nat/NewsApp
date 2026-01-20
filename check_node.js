console.log('Node version:', process.version);
try {
    const arr = [1, 2, 3];
    console.log('toReversed exists type:', typeof arr.toReversed);
    console.log('Result:', arr.toReversed());
} catch (e) {
    console.error('Error:', e.message);
}
