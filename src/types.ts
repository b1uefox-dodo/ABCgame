// A key press signal. The `seq` counter makes every press a unique value
// so React effects keyed on this fire even when the same key repeats.
export interface KeyPress {
  key: string;
  seq: number;
}
