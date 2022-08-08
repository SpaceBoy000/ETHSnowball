import Typography from "@mui/material/Typography";
import { styled } from "@mui/system";
import logo from "../../assets/FullLogo.png";
import Connect from "./Connect";
import { useTranslation } from "react-i18next";
import Grid from "@mui/material/Grid";

import { Link } from 'react-router-dom'
import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi"

const Wrapper = styled("div")(({ theme }) => ({
  // position: "fixed",
  // zIndex: "40",
  // left: 0,
  // top: 0,
  // right: 0,
  // background: "white",
  // boxShadow: 'rgba(33, 35, 38, 0.1) 0px 10px 10px -10px',

  [theme.breakpoints.down("md")]: {
    h5: {
      fontSize: 20,
      margin: 0,
    },
  },
}));

const AdvPanel = styled("div")(({ theme }) => ({
  background: theme.palette.purple.main,
  textAlign: 'center',
  color: 'white',
  padding: '10px 0 10px 0'
}));

const Item = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  padding: '20px 0 20px 0',
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const ItemConnect = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  padding: '20px 0 20px 0',
  textAlign: 'center',
  color: theme.palette.text.secondary,
  [theme.breakpoints.down("md")]: {
    padding: '10px 0',
    display: 'none'
  },
}));

export default function Header() {
  const [mobile, setMobile] = useState(false);

  return (
    <Wrapper>
      { mobile === true ? (
        <div>
          <div className="mobile_head">
            <div className="mobile_herader_content">
              <div style={{alignSelf:"center", marginBottom:"30px"}}>
                <img src="./favicon.png" alt="ETH Snowball" width="60px"/>
              </div>
              <div className="mobile_four_btn">
                <div onClick= {() => {
                  setMobile(true)
                }}>
                  <Link
                    to="/miner"
                    className="swap_btn"
                    style={{
                      color: 'white',
                      textDecoration: 'none',
                      fontWeight:"bolder"
                    }}
                  >
                    Miner
                  </Link>
                </div>
                <div onClick={() => {
                  setMobile(true)
                }}>
                  <Link
                    to="/nft"
                    className="stable_btn"
                    style={{
                      color: 'white',
                      textDecoration: 'none',
                      fontWeight:"bolder"
                    }}
                  >
                    NFT
                  </Link>
                </div>
                <div onClick={() => {
                  setMobile(true)
                }}>
                  <Link
                    to="/gamefi"
                    className="bridge_btn"
                    style={{
                      color: 'white',
                      textDecoration: 'none',
                      fontWeight:"bolder"
                    }}
                  >
                    Gamefi
                  </Link>
                </div>
                <div onClick={() => {
                  setMobile(true)
                }}>
                  <Link
                    to="/marketplace"
                    className="liquidity_btn"
                    style={{
                      color: 'white',
                      textDecoration: 'none',
                      fontWeight:"bolder"
                    }}
                  >
                    NFT Marketplace
                  </Link>
                </div>
                <div onClick={() => {
                  setMobile(true)
                }}>
                  <Typography variant="h6">
                    <a href="/roadmap.jpg" target="_blank" style={{textDecoration: 'inherit', color:"white"}}>
                      RoadMap
                    </a>
                  </Typography>
                </div>
              </div>
              <div style={{flex:1}}></div>
              <div
                className="mobile_connect"
              >
                <Connect />
              </div>
            </div>
            <div
              className="empty_mobile"
              onClick={() => {
                setMobile(false)
              }}
            ></div>
          </div>
        </div>
      )
      : null }
   
      <Grid container spacing={2}>
        <Grid item xs={9} sm={6} md={3}>
          <Item>
            <img src={logo} alt="" style={{ maxHeight: "32px", marginRight: "16px" }} />
            <Typography variant="h5" textAlign="center" color='#03989e'>
              ETH Snowball
            </Typography>
          </Item>
        </Grid>
        <Grid className="header_menu" item xs={0} sm={0} md={6}>
          <Item>
            <Link
              to="/"
              style={{
                color: '#03989e',
                textDecoration: 'none',
                fontWeight: "bolder",
                fontSize: "20px"
              }}
            >
                Miner
            </Link>
          </Item>
          <Item>
            <Link
              to="nft"
              style={{
                color: '#03989e',
                textDecoration: 'none',
                fontWeight: "bolder",
                fontSize: "20px"
              }}
            >
                NFT
            </Link>
          </Item>
          <Item>
            <Link
              to="/gamefi"
              style={{
                color: '#03989e',
                textDecoration: 'none',
                fontWeight: "bolder",
                fontSize: "20px"
              }}
            >
                Gamefi
            </Link>
          </Item>
          <Item>
            <Link
              to="/marketplace"
              style={{
                color: '#03989e',
                textDecoration: 'none',
                fontWeight: "bolder",
                fontSize: "20px"
              }}
            >
                NFT Marketplace
            </Link>
          </Item>
          <Item>
            <Typography variant="h6" textAlign="center" color='#03989e'>
              <a href="/roadmap.jpg" target="_blank" style={{textDecoration: 'inherit'}}>
                RoadMap
              </a>
            </Typography>
          </Item>
        </Grid>
        <Grid item xs={3} sm={6} md={3} sx={{alignSelf:"center"}}>
          <ItemConnect>
            <Connect />
          </ItemConnect>
          <div
            className="mobile_btn"
            onClick={() => {
              setMobile(true)
            }}
          >
            <GiHamburgerMenu/>
          </div>
        </Grid>
      </Grid>

      {/* <Typography variant="h3" textAlign="center" color="black" marginTop={'40px'}>
        The New Wave of Miner Integrated with NFT
      </Typography> */}
    </Wrapper>
  );
}
