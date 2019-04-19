export default function setCaretPosition(elem, caretPos) {
  if (elem.createTextRange) {
    let range = elem.createTextRange();

    range.move('character', caretPos);
    range.select();
  } else {
    if (elem.selectionStart) {
        elem.focus();
        elem.setSelectionRange(caretPos, caretPos);
    } else {
      elem.focus();
    }
  }
}