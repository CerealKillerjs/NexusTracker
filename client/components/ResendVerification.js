import React, { useContext } from "react";

import Button from "./Button";
import { NotificationContext } from "./Notifications";
import LoadingContext from "../utils/LoadingContext";
import LocaleContext from "../utils/LocaleContext";

const ResendVerification = ({ token }) => {
  const { addNotification } = useContext(NotificationContext);
  const { setLoading } = useContext(LoadingContext);
  const { getLocaleString } = useContext(LocaleContext);

  
  const SQ_API_URL = process.env.SQ_API_URL;
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleResend = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${SQ_API_URL}/account/resend-verification`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        addNotification(
          "success",
          getLocaleString("verificationEmailResent")
        );
      } else {
        const error = await res.text();
        addNotification(
          "error",
          error
        );
      }
    } catch (e) {
      addNotification(
        "error",
        e.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleResend} small>
      {getLocaleString("resendVerificationEmail")}
    </Button>
  );
};

export default ResendVerification; 
