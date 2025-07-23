import React, { forwardRef } from "react";

const InvoiceComponent = forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <div ref={ref}>
      <h1>Hello from Printable Component</h1>
      <p>This content will be printed or exported as PDF.</p>
    </div>
  );
});

export default InvoiceComponent;
