/* eslint-disable react-hooks/exhaustive-deps */
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import Divider from "@mui/material/Divider";
import { styled } from "@mui/system";
import { useLocation } from "react-router-dom";
import Web3 from "web3";

import PriceInput from "../../components/PriceInput";
import { useContractContext } from "../../providers/ContractProvider";
import { useAuthContext } from "../../providers/AuthProvider";
import { useEffect, useState } from "react";
import { config } from "../../config";
import { useTranslation } from "react-i18next";
import { Toast } from "../../utils"
import { shorten } from "./Connect";
import ReferralLink from "./ReferralLink";

const CardWrapper = styled("div")(({ theme }) => ({
    maxWidth: 400,
    margin: "0 auto",
    transition: "box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
    overflow: "hidden",
    boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
    borderRadius: "5px",
    background: theme.palette.primary.main,
    marginBottom: 24,
}));

const DevilButton = styled(Button)(({ theme }) => ({
    "&:disabled": { background: 'rgba(0, 0, 0, 0.12)', color: 'rgb(150, 150, 150) !important' },
    "&: hover": { background: theme.button.secondary.main },
    borderRadius: 5,
    background: theme.button.primary.main,
    color: theme.typography.allVariants.color,
    boxShadow: 'none',
}));

const ButtonContainer = styled(Grid)(({ theme }) => ({
    [theme.breakpoints.down("sm")]: {
        flexDirection: "column",
        "> div": {
            marginLeft: 0,
            marginRight: 0,
        },
    },
}));

let timeout = null;

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export const numberWithCommas = (x, digits = 3) => {
    return Number(x).toLocaleString(undefined, { maximumFractionDigits: digits });
}

export default function BakeCard() {
    const { tokenContract, contract, wrongNetwork, getBnbBalance, fromWei, toWei, web3 } =
        useContractContext();
    const { address, chainId } = useAuthContext();
    const [contractBNB, setContractBNB] = useState(0);
    const [approvedAmount, setApprovedAmount] = useState(0);
    const [walletBalance, setWalletBalance] = useState({
        bnb: 0,
        beans: 0,
        rewards: 0,
    });
    const [bakeBNB, setBakeBNB] = useState(0);
    const [calculatedBeans, setCalculatedBeans] = useState(0);
    const [loading, setLoading] = useState(false);
    const query = useQuery();
    const { t, i18n } = useTranslation();

    const EGGS_TO_HIRE_1MINERS = 1440000; // 3.3%, 864000: 10%;

    const [lasthatch, setLasthatch] = useState(0);
    const [compoundTimes, setCompoundTimes] = useState(0);
    const [yourLevel, setYourLevel] = useState(0);
    const [referrals, setReferrals] = useState(0);
    const [refRewards, setRefRewards] = useState(0);
    const [countdown, setCountdown] = useState({
        alive: true,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    })

    // Lottery
    const zeroAddrss = '0x0000000000000000000000000000000000000000';
    const [roundStarted, setRoundStarted] = useState(false);
    const [roundStartTime, setRoundStartTime] = useState(0);
    const [lotteryWinner, setLotteryWinner] = useState(zeroAddrss);
    const [roundIntervalLottery, setRoundIntervalLottery] = useState(0);
    const [ticketCount, setTicketCount] = useState(0);
    const [lastTicketCount, setLastTicketCount] = useState(0);
    const [totalTicketCount, setTotalTicketCount] = useState(0);
    const [countdownLottery, setCountdownLottery] = useState({
        alive: true,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    })

    const getCountdown = (lastCompound) => {
        const now = Date.now() / 1000;
        const total = lastCompound > 0 ? Math.max(lastCompound - now, 0) : 0;
        const seconds = Math.floor((total) % 60);
        const minutes = Math.floor((total / 60) % 60);
        const hours = Math.floor((total / (60 * 60)) % 24);
        const days = Math.floor(total / (60 * 60 * 24));

        return {
            total,
            days,
            hours,
            minutes,
            seconds
        };
    }

    useEffect(() => {
        const intervalID = setInterval(() => {
            try {
                const last = Number(lasthatch);
                const data = getCountdown(last + 24 * 3600 + 60); //24 * 3600
                setCountdown({
                    alive: data.total > 0,
                    days: data.days,
                    hours: data.hours,
                    minutes: data.minutes,
                    seconds: data.seconds,
                });

            } catch (err) {
                console.log(err);
            }
        }, 1000);
        return () => {
            clearInterval(intervalID)
        }
    }, [lasthatch])

    const fetchContractBNBBalance = async () => {
        if (!web3 || wrongNetwork) {
            setContractBNB(0);
            return;
        }
        // await contract.methods.getBalance().call().then((amount) => {
        //     setContractBNB(fromWei(amount));
        // });
        await tokenContract.methods.balanceOf(config.contractAddress).call().then((amount) => {
            setContractBNB(fromWei(amount));
        })
    };

    const fetchWalletBalance = async () => {
        if (!web3 || wrongNetwork || !address) {
            setWalletBalance({
                bnb: 0,
                beans: 0,
                rewards: 0,
            });
            setCompoundTimes(0);
            setYourLevel(0);
            return;
        }

        try {
            console.log("address: ", address);

            const [approvedAmount, bnbAmount, rewardsAmount, userInfo] = await Promise.all([
                tokenContract.methods
                    .allowance(address, config.contractAddress)
                    .call()
                    .catch((err) => {
                        console.error("BalanceChecking Error: ", err);
                        return 0;
                    }),
                tokenContract.methods
                    .balanceOf(address)
                    .call()
                    .catch((err) => {
                        console.error("BalanceChecking Error: ", err);
                        return 0;
                    }),
                contract.methods
                    .getAvailableEarnings(address)
                    .call({ from: address })
                    .catch((err) => {
                        console.error("getAvailableEarnings error: ", err);
                        return 0;
                    }),
                contract.methods
                    .users(address)
                    .call()
                    .catch((err) => {
                        console.error("userInfo error", err);
                        return 0;
                    })
            ]);

            console.log("approvedAmount: ", fromWei(`${approvedAmount}`));
            console.log("UserInfo: ", userInfo);

            const refReward = await contract.methods.calculateEggSell(userInfo.referralEggRewards)
                .call()
                .catch((err) => {
                    console.error("calculateEggSell", err);
                    return 0;
                });
            console.log("refReward: ", refReward);
            setApprovedAmount(fromWei(`${approvedAmount}`));

            setWalletBalance({
                bnb: fromWei(`${bnbAmount}`),
                beans: userInfo.miners,
                rewards: fromWei(`${rewardsAmount}`),
            });
            setLasthatch(userInfo.lastHatch);
            setCompoundTimes(userInfo.dailyCompoundBonus);
            setYourLevel(userInfo.level);
            setReferrals(userInfo.referralsCount);
            setRefRewards(fromWei(`${refReward}`));
        } catch (err) {
            console.error(err);
            setWalletBalance({
                bnb: 0,
                beans: 0,
                rewards: 0,
            });
            // setLasthatch(0);
            setCompoundTimes(0);
            setYourLevel(0);
        }
    };

    // const fetchLottoryInfo = async () => {
    //     if (!web3 || wrongNetwork || !address) {
    //         setTicketCount(0);
    //         setLastTicketCount(0);
    //         setTotalTicketCount(0);
    //         setRoundStartTime(0);
    //         setRoundIntervalLottery(0);
    //         // setRoundStarted(false);
    //         setLotteryWinner(zeroAddrss);

    //         return;
    //     }
    //     const [roundStarted, roundID] = await Promise.all([
    //         contract.methods.lotteryStarted()
    //             .call()
    //             .catch((err) => {
    //                 console.error("lottory error:", err);
    //             }),
    //         contract.methods.LOTTERY_ROUND()
    //             .call()
    //             .catch((err) => {
    //                 console.error("lottory error:", err);
    //             })
    //     ]);;
    //     const [roundStartTime, roundInterval, lastLotteryInfo, currentLotteryInfo, ticketCnt, lastTicketCnt] = await Promise.all([
    //         contract.methods.LOTTERY_START_TIME()
    //             .call()
    //             .catch((err) => {
    //                 console.error("lottory error: ", err);
    //             }),
    //         contract.methods.LOTTERY_INTERVAL()
    //             .call()
    //             .catch((err) => {
    //                 console.error("lottory LOTTERY_INTERVAL error: ", err);
    //             }),
    //         contract.methods.lotteryInfo(roundID - 1)
    //             .call()
    //             .catch((err) => {
    //                 console.error("lottory error: ", err);
    //             }),
    //         contract.methods.lotteryInfo(roundID)
    //             .call()
    //             .catch((err) => {
    //                 console.error("lottory error: ", err);
    //             }),
    //         contract.methods.getUserTicketInfo(address, roundID)
    //             .call()
    //             .catch((err) => {
    //                 console.error("lottory error: ", err);
    //             }),
    //         contract.methods.getUserTicketInfo(address, roundID - 1)
    //             .call()
    //             .catch((err) => {
    //                 console.error("lottory error: ", err);
    //             }),
    //     ]);
    //     setLotteryWinner(lastLotteryInfo.winnerAccount);

    //     console.log("totalTicketCnt: ", currentLotteryInfo.totalTicketCnt);
    //     setTicketCount(ticketCnt);
    //     setLastTicketCount(lastTicketCnt);
    //     setTotalTicketCount(currentLotteryInfo.totalTicketCnt);
    //     setRoundStartTime(roundStartTime);
    //     setRoundIntervalLottery(roundInterval);
    //     setRoundStarted(roundStarted);
    //     console.log("roundStarted: ", roundInterval);
    // }

    useEffect(() => {
        fetchContractBNBBalance();
    }, [web3, chainId]);

    useEffect(() => {
        fetchWalletBalance();
        // fetchLottoryInfo();
    }, [address, web3, chainId]);

    const onUpdateBakeBNB = (value) => {
        setBakeBNB(value);
    };

    const getRef = () => {
        const ref = Web3.utils.isAddress(query.get("ref"))
            ? query.get("ref")
            : "0xBA2Dd8dB1728D8DE3B3b05cc1a5677F005f34Ba3"; // "0x0000000000000000000000000000000000000000";
        return ref;
    };

    const approve = async () => {
        console.log("=========== approve ==============");
        setLoading(true);

        const ref = getRef();

        try {
            await tokenContract.methods.approve(config.contractAddress, toWei(`${bakeBNB}`),).send({
                from: address,
            });
        } catch (err) {
            console.error(err);
        }
        fetchWalletBalance();
        setLoading(false);
    };

    const bake = async () => {
        setLoading(true);

        const ref = getRef();
        console.log("bake: ", toWei(`${bakeBNB}`), ref);
        try {
            await contract.methods.BuyPixels(toWei(`${bakeBNB}`), ref).send({
                from: address,
            });
        } catch (err) {
            console.error(err);
        }
        fetchWalletBalance();
        fetchContractBNBBalance();
        // fetchLottoryInfo();
        setLoading(false);
    };

    const reBake = async () => {
        setLoading(true);

        const ref = getRef();

        try {
            await contract.methods.CompoundRewards(ref).send({
                from: address,
            });
        } catch (err) {
            console.error(err);
        }
        fetchWalletBalance();
        setLoading(false);
    };

    const eatBeans = async () => {
        setLoading(true);

        if (countdown.alive) {
            Toast.fire({
                icon: 'error',
                title: "You should wait until the countdown timer is done."
            });
            setLoading(false);
            return;
        }

        try {
            await contract.methods.SellMegaPixels().send({
                from: address,
            });
        } catch (err) {
            console.error(err);
        }
        fetchWalletBalance();
        fetchContractBNBBalance();
        setLoading(false);
    };

    return (
        <>
            <CardWrapper>
                {loading && <LinearProgress color="secondary" />}
                <CardContent>
                    <Grid
                        container
                        justifyContent="space-between"
                        alignItems="center"
                        mt={3}
                    >
                        <Typography variant="body1" color="black">{t("Contract Balance")}</Typography>
                        <Typography variant="h5">{contractBNB} ARB</Typography>
                    </Grid>
                    {/* <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          mt={3}
        >
          <Typography variant="body1" color="black">{t("Total Investment")}</Typography>
          <Typography variant="h5">{walletBalance.tvls} ARB</Typography>
        </Grid> */}
                    <Grid
                        container
                        justifyContent="space-between"
                        alignItems="center"
                        mt={3}
                    >
                        <Typography variant="body1" color="black">{t("Wallet Balance")}</Typography>
                        <Typography variant="h5">{walletBalance.bnb} ARB</Typography>
                    </Grid>
                    <Grid
                        container
                        justifyContent="space-between"
                        alignItems="center"
                        mt={3}
                    >
                        <Typography variant="body1" color="black">{t("Your Pixels")}</Typography>
                        <Typography variant="h5">{numberWithCommas(walletBalance.beans)} Pixels</Typography>
                    </Grid>
                    <Box paddingTop={4} paddingBottom={3}>
                        <Box>
                            <PriceInput
                                max={+walletBalance.bnb}
                                value={bakeBNB}
                                onChange={(value) => onUpdateBakeBNB(value)}
                            />
                        </Box>
                        <Box marginTop={3} marginBottom={3}>
                            <DevilButton
                                variant="contained"
                                fullWidth
                                disabled={wrongNetwork || !address || +bakeBNB === 0 || loading}
                                onClick={bakeBNB > approvedAmount ? approve : bake}
                            >
                                {bakeBNB > approvedAmount ? t("Approve") : t("BUY PIXELS")}
                            </DevilButton>
                        </Box>
                        <Divider />
                        <Grid
                            container
                            justifyContent="space-between"
                            alignItems="center"
                            mt={3}
                        >
                            <Typography variant="body1" fontWeight="bolder" color="black">
                                {t("Compound Counter")}
                            </Typography>
                            <Typography variant="h5" fontWeight="bolder"
                                sx={{
                                    color: compoundTimes >= 6 ? "Green" : "red"
                                }}
                            >
                                {compoundTimes}
                            </Typography>
                        </Grid>
                        <Grid
                            container
                            justifyContent="space-between"
                            alignItems="center"
                            mt={3}
                        >
                            <Typography variant="body1" fontWeight="bolder" color="black">
                                {t("Your Rewards")}
                            </Typography>
                            <Typography variant="h5" fontWeight="bolder">
                                {walletBalance.rewards} ARB
                            </Typography>
                        </Grid>
                        <ButtonContainer container>
                            <Grid item flexGrow={1} marginTop={3}>
                                <DevilButton
                                    variant="contained"
                                    color="secondary"
                                    fullWidth
                                    disabled={wrongNetwork || !address || countdown.alive || loading}
                                    onClick={reBake}
                                >
                                    {countdown.alive ? countdown.hours + "H " + countdown.minutes + "M " + countdown.seconds + "S" : 'Pixelate'}
                                </DevilButton>
                            </Grid>
                            <Grid item flexGrow={1} marginTop={3}>
                                <DevilButton
                                    variant="contained"
                                    color="secondary"
                                    fullWidth
                                    disabled={wrongNetwork || !address || loading}
                                    onClick={eatBeans}
                                >
                                    {t("Sell Megapixels")}
                                </DevilButton>
                            </Grid>
                        </ButtonContainer>
                    </Box>
                </CardContent>
            </CardWrapper>
            <ReferralLink
                address={address}
                referrals={referrals}
                refRewards={refRewards}
            />
        </>
    );
}
