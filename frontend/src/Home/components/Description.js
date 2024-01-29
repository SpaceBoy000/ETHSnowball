import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";

import { styled } from "@mui/system";
import { useTranslation } from "react-i18next";
import { Toast } from "../../utils"
import { config } from "../../config";

const CardWrapper = styled("div")(({ theme }) => ({
  margin: "0 auto 24px auto",
  padding: "29px",
}));

const CardWrapper2 = styled(Card)(({ theme }) => ({
  background: theme.palette.purple.main,
  borderRadius: "0.5rem",
  boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
  padding: "12px",
  maxWidth: "640px",
  transition: '0.5s',
}));

const CardWrapper3 = styled(Card)(({ theme }) => ({
  background: theme.palette.purple.main,
  borderRadius: "0.5rem",
  boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
  padding: "12px",
  width: "1096px",
  transition: '0.5s',
}));

const CustomCardHeader = styled(Typography)(({ theme }) => ({
  marginBottom: '16px',
  // textDecoration: "underline",
  // textDecorationColor: "#0abcf9",
  textDecorationThickness: "2px",
  textUnderlinePosition: "under",
  fontFamily: 'joystix',
  color: theme.typography.allVariants.color,
  fontSize: '20px'
}))


export default function Description() {

  return (
    <CardWrapper>
      <Grid item xs={12} sm={12} md={12}>
        <Grid
          container
          justifyContent="center"
          columns={12}
          spacing={2}
          sx={{
            textAlign: 'left',
          }}
        >
          <Grid item xs={12} sm={12} md={12}>
            <Grid
              container
              justifyContent="center"
              columns={12}
              spacing={2}
              sx={{
                textAlign: 'left',
              }}
            >
              <Grid item xs={12} sm={12} md={12} sx={{ display: 'flex', justifyContent: 'end' }}>
                <Grid
                  container
                  spacing={2}
                  sx={{ display: 'flex', justifyContent: 'end' }}
                >
                  <Grid item xs={12} sm={12} md={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <CardWrapper2>
                      <CustomCardHeader variant="body4">
                        {`How does it work?`}
                      </CustomCardHeader>
                      <Typography variant="body2" sx={{ mt: 2 }}>
                        Pixel Miner is a dapp built on Arbitrum and aims to provide the highest sustainable returns possible.
                        To start generating $ARB you need to purchase "Pixels" using $ARB.
                        Pixelate your pixels to generate  higher yields.
                        The more pixels you accumulate and the more often you pixelate, the greater the potential for earning more $ARB.
                        For more information check out <a href={ config.doc_link } target="_blank" alt="Docs link" style={{ color: 'white' }}>DOCS</a>
                      </Typography>
                    </CardWrapper2>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </CardWrapper>
  );
}
