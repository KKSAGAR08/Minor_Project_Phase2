import React from "react";
import ForgetPassword from "../components/ui/forgetPassword";

function PasswordSet({ heading, subheading, url }) {
  return (
    <>
      <ForgetPassword heading={heading} subheading={subheading} url={url} />
    </>
  );
}

export default PasswordSet;
