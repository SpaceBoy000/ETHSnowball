import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { styled } from "@mui/system";
import { useTranslation } from "react-i18next";
import { Toast } from "../../utils"
import { numberWithCommas } from "./BakeCard"; 

const CardWrapper = styled("div")(({ theme }) => ({
  maxWidth: 400,
  margin: "0 auto",
  transition: "box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
  overflow: "hidden",
  boxShadow: "rgb(0 0 0 / 59%) 6px 6px 20px 6px",
  borderRadius: "5px",
  background: theme.palette.purple.main,
  marginBottom: 24,
}));


const DevilButton = styled(Button)(({ theme }) => ({
  "&:disabled": { background: 'rgba(0, 0, 0, 0.12)' },
  borderRadius: 5,
  background: theme.button.primary.main,
  color: theme.typography.allVariants.color,
  [theme.breakpoints.down("md")]: {
    display: "none",
  },
}));

// const DevilButton = styled(Button)(({ theme }) => ({
//   "&:disabled": { background: 'rgba(0, 0, 0, 0.12)' },
//   // "&: hover": { background: theme.button.secondary.main },
//   borderRadius: 5,
//   background: theme.button.primary.main,
//   color: theme.typography.allVariants.color,
//   boxShadow: 'none',
// }));


const Input = styled("input")(({ theme }) => ({
  fontSize: 10,
  fontWeight: 300,
  padding: "10px 12px",
  borderRadius: 0,
  border: "1px solid #555",
  background: "white",
  width: "100%",
  outline: "none",
  color: theme.palette.primary.main,
}));

export default function ReferralLink({ address, referrals, refRewards }) {
  const link = `${window.origin}?ref=${address}`;
  const { t, i18n } = useTranslation();

  const onCopyReferral = (e) => {
    navigator.clipboard.writeText(link);
    Toast.fire({
      icon: 'success',
      title: "Copied to clipboard!"
    });
  }

  return (
    <CardWrapper>
      <CardContent >
        <Typography gutterBottom variant="h5" textAlign="left" color="white">
          {t("Referral Link")}
        </Typography>
        <Input sx={{color:"#004AAD", fontSize:"15px", cursor:"pointer", fontWeight:"bolder"}} onClick={onCopyReferral} value={address ? link : ""} readOnly />

        {/* <DevilButton
          variant="contained"
          fullWidth
          onClick={onCopyReferral}
          style={{marginTop: 12}}
        >
          {t("COPY")}
        </DevilButton> */}
        <Typography
          textAlign="center"
          variant="body2"
          marginTop={2}
          paddingX={3}
        >
          {t("Earn 10% of the ARB used to buy Pixels from anyone who uses your referral link")}
        </Typography>
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          mt={3}
        >
          <Typography variant="body1" color="white">{t("Referrals")}</Typography>
          <Typography variant="h5" color="white">{ referrals }</Typography>
        </Grid>
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          mt={3}
        >
          <Typography variant="body1" color="white">{t("Referral rewards")}</Typography>
          <Typography variant="h5" color="white">{ numberWithCommas(refRewards) } ARB</Typography>
        </Grid>
      </CardContent>
    </CardWrapper>
  );
}
