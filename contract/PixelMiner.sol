// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

/*
*
*
*    ________    ___      ___    ___  _______       ___               _____ ______       ___      ________       _______       ________     
*   |\   __  \  |\  \    |\  \  /  /||\  ___ \     |\  \             |\   _ \  _   \    |\  \    |\   ___  \    |\  ___ \     |\   __  \    
*   \ \  \|\  \ \ \  \   \ \  \/  / /\ \   __/|    \ \  \            \ \  \\\__\ \  \   \ \  \   \ \  \\ \  \   \ \   __/|    \ \  \|\  \   
*    \ \   ____\ \ \  \   \ \    / /  \ \  \_|/__   \ \  \            \ \  \\|__| \  \   \ \  \   \ \  \\ \  \   \ \  \_|/__   \ \   _  _\  
*     \ \  \___|  \ \  \   /     \/    \ \  \_|\ \   \ \  \____        \ \  \    \ \  \   \ \  \   \ \  \\ \  \   \ \  \_|\ \   \ \  \\  \| 
*      \ \__\      \ \__\ /  /\   \     \ \_______\   \ \_______\       \ \__\    \ \__\   \ \__\   \ \__\\ \__\   \ \_______\   \ \__\\ _\ 
*       \|__|       \|__|/__/ /\ __\     \|_______|    \|_______|        \|__|     \|__|    \|__|    \|__| \|__|    \|_______|    \|__|\|__|
*                        |__|/ \|__|                                                                                                        
*                                                                                    
* PixelMiner - Arbitrum Miner
*
* Twitter  : https://twitter.com/
* Telegram : https://t.me/
*
*/

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";


contract PixelMiner is Ownable {
    using SafeMath for uint256;

    IERC20 public ARB_TOKEN;

    /* base parameters */
    uint256 public EGGS_TO_HIRE_1MINERS = 1080000;
    uint256 public REFERRAL = 100;  //10%
    uint256 public TAX = 50; // 5%
    uint256 public PERCENTS_DIVIDER = 1000;
    uint256 public MARKET_EGGS_DIVISOR = 5;
    uint256 public MARKET_EGGS_DIVISOR_SELL = 2;

    uint256 public MIN_INVEST_LIMIT = 1 * 1e18; /* 1 ARB  */
    
	uint256 public COMPOUND_BONUS_MAX_TIMES = 1000;
    uint256 public COMPOUND_STEP = 1 days;

    uint256 public EARLY_WITHDRAWAL_TAX = 500;
    uint256 public COMPOUND_FOR_NO_TAX_WITHDRAWAL = 6; // 6


    uint256 public totalTax;

    uint256 private marketEggs;
    uint256 PSN = 10000;
    uint256 PSNH = 5000;
    bool private contractStarted;

	uint256 public CUTOFF_STEP = 1 days;
	uint256 public WITHDRAW_COOLDOWN = 1 days;

    struct User {
        uint256 initialDeposit;
        uint256 miners;
        uint256 claimedEggs;
        uint256 lastHatch;
        address referrer;
        uint256 referralsCount;
        uint256 referralEggRewards;
        uint256 dailyCompoundBonus;
        mapping(uint16 => uint256) ticketCount;
        uint8 level;
    }

    mapping(address => User) public users;

    
    constructor(address arb) {
        marketEggs = 144000000000;
        ARB_TOKEN = IERC20(arb);
    }

    function Pixelate(address ref) public {
        require(contractStarted, "Contract not yet Started.");

        User storage user = users[msg.sender];
        if (user.referrer == address(0)) {
            if (ref != msg.sender) {
                user.referrer = ref;
            }

            address upline1 = user.referrer;
            if (upline1 != address(0)) {
                users[upline1].referralsCount = users[upline1].referralsCount.add(1);
            }
        }
                
        uint256 eggsUsed = getMyEggs();
        if(block.timestamp.sub(user.lastHatch) >= COMPOUND_STEP && user.dailyCompoundBonus < COMPOUND_BONUS_MAX_TIMES) {
            user.dailyCompoundBonus = user.dailyCompoundBonus.add(1);
        }
        
        user.miners = user.miners.add(eggsUsed.div(EGGS_TO_HIRE_1MINERS));
        user.claimedEggs = 0;
        user.lastHatch = block.timestamp;

        if (user.referrer != address(0)) {
            address upline = user.referrer;
            uint256 refRewards = eggsUsed.mul(REFERRAL).div(PERCENTS_DIVIDER);
            users[upline].claimedEggs = SafeMath.add(users[upline].claimedEggs, refRewards);
            users[upline].referralEggRewards = users[upline].referralEggRewards.add(refRewards);
        }

        marketEggs = marketEggs.add(eggsUsed.div(MARKET_EGGS_DIVISOR));
    }

    function SellMegaPixels() public {
        require(contractStarted, "Contract not yet Started.");

        User storage user = users[msg.sender];
        require(user.lastHatch + WITHDRAW_COOLDOWN <= block.timestamp);

        uint256 hasEggs = getMyEggs();
        uint256 eggValue = calculateEggSell(hasEggs);
        
        /** 
            if user compound < to mandatory compound days**/
        if (user.dailyCompoundBonus < COMPOUND_FOR_NO_TAX_WITHDRAWAL){
            //daily compound bonus count will not reset and eggValue will be deducted with 50% feedback tax.
            eggValue = eggValue.sub(eggValue.mul(EARLY_WITHDRAWAL_TAX).div(PERCENTS_DIVIDER));
        } else {
            //set daily compound bonus count to 0 and eggValue will remain without deductions
             user.dailyCompoundBonus = 0;
        }
        
        user.claimedEggs = 0;  
        user.lastHatch = block.timestamp;
        marketEggs = marketEggs.add(hasEggs.div(MARKET_EGGS_DIVISOR_SELL));

        if(getBalance() < eggValue) {
            eggValue = getBalance();
        }

        uint256 eggsPayout = eggValue.sub(payFees(eggValue));
        
        ARB_TOKEN.transfer(msg.sender, eggsPayout);
    }
     
    /* transfer amount of ARB */
    function BuyPixels(uint256 amount, address ref) public {
        require(contractStarted, "Contract not yet Started.");

        User storage user = users[msg.sender];
        
        require(amount >= MIN_INVEST_LIMIT, "Mininum investment not met.");
        ARB_TOKEN.transferFrom(msg.sender, address(this), amount);

        uint256 eggsBought = calculateEggBuy(amount, getBalance().sub(amount));
        user.initialDeposit = user.initialDeposit.add(amount);
        user.claimedEggs = user.claimedEggs.add(eggsBought);
        user.lastHatch = block.timestamp;
        user.dailyCompoundBonus = 0;

        payFees(amount);
        Pixelate(ref);
    }

    function Launch() public {
        if (!contractStarted) {
    		if (msg.sender == owner()) {
    			contractStarted = true;
    		} else revert("Contract not yet started.");
    	}
    }

    function payFees(uint256 eggValue) internal returns(uint256) {
        uint256 tax = eggValue.mul(TAX).div(PERCENTS_DIVIDER);
        ARB_TOKEN.transfer(owner(), tax);
        
        return tax;
    }

    function getBalance() public view returns(uint256){
        return ARB_TOKEN.balanceOf(address(this));
    }

    function getTimeStamp() public view returns (uint256) {
        return block.timestamp;
    }

    function getAvailableEarnings(address _adr) public view returns(uint256) {
        uint256 userEggs = users[_adr].claimedEggs.add(getEggsSinceLastHatch(_adr));
        return calculateEggSell(userEggs);
    }

    //  Supply and demand balance algorithm 
    function calculateTrade(uint256 rt,uint256 rs, uint256 bs) public view returns(uint256){
    // (PSN * bs)/(PSNH + ((PSN * rs + PSNH * rt) / rt)); PSN / PSNH == 1/2
    // bs * (1 / (1 + (rs / rt)))
    // purchase ： marketEggs * 1 / ((1 + (this.balance / eth)))
    // sell ： this.balance * 1 / ((1 + (marketEggs / eggs)))
        return SafeMath.div(
                SafeMath.mul(PSN, bs), 
                    SafeMath.add(PSNH, 
                        SafeMath.div(
                            SafeMath.add(
                                SafeMath.mul(PSN, rs), 
                                    SafeMath.mul(PSNH, rt)), 
                                        rt)));
    }

    function calculateEggSell(uint256 eggs) public view returns(uint256){
        return calculateTrade(eggs, marketEggs, getBalance());
    }

    function calculateEggBuy(uint256 eth,uint256 contractBalance) public view returns(uint256){
        return calculateTrade(eth, contractBalance, marketEggs);
    }

    function calculateEggBuySimple(uint256 eth) public view returns(uint256){
        return calculateEggBuy(eth, getBalance());
    }

    /* How many snows per day user will receive based on ETH deposit */
    function getEggsYield(uint256 amount) public view returns(uint256,uint256) {
        uint256 eggsAmount = calculateEggBuy(amount , getBalance().add(amount).sub(amount));
        uint256 miners = eggsAmount.div(EGGS_TO_HIRE_1MINERS);
        uint256 day = 1 days;
        uint256 eggsPerDay = day.mul(miners);
        uint256 earningsPerDay = calculateEggSellForYield(eggsPerDay, amount);
        return(miners, earningsPerDay);
    }

    function calculateEggSellForYield(uint256 eggs,uint256 amount) public view returns(uint256){
        return calculateTrade(eggs,marketEggs, getBalance().add(amount));
    }

    function getMyEggs() public view returns(uint256){
        return users[msg.sender].claimedEggs.add(getEggsSinceLastHatch(msg.sender));
    }

    function getEggsSinceLastHatch(address adr) public view returns(uint256){
        uint256 secondsSinceLastHatch = block.timestamp.sub(users[adr].lastHatch);
                            /* get min time. */
        uint256 cutoffTime = min256(secondsSinceLastHatch, CUTOFF_STEP);
        uint256 secondsPassed = min256(EGGS_TO_HIRE_1MINERS, cutoffTime);
        return secondsPassed.mul(users[adr].miners);
    }

    function min256(uint256 a, uint256 b) private pure returns (uint256) {
        return a < b ? a : b;
    }
    

    /* APR setters */
    // 2880000 - 3%, 2160000 - 4%, 1728000 - 5%, 1440000 - 6%, 1200000 - 7%
    // 1080000 - 8%, 959000 - 9%, 864000 - 10%, 720000 - 12%
    
    function SET_EGGS_TO_HIRE_1MINERS(uint256 value) external {
        require(msg.sender == owner(), "Admin use only.");
        require(value <= 2880000 && value >= 720000, "Min 3%, Max 12%");
        EGGS_TO_HIRE_1MINERS = value;
    }

    function SET_MARKET_EGGS_DIVISOR(uint256 value) external {
        require(msg.sender == owner(), "Admin use only.");
        require(value <= 50);
        MARKET_EGGS_DIVISOR = value;
    }

    function SET_MARKET_EGGS_DIVISOR_SELL(uint256 value) external {
        require(msg.sender == owner(), "Admin use only.");
        require(value <= 50);
        MARKET_EGGS_DIVISOR_SELL = value;
    }

    function SET_TAX(uint256 value) external {
        require(msg.sender == owner(), "Admin use only.");
        require(value <= 100, "available to 10%");
        TAX = value;
    }

    function SET_WITHDRAWAL_TAX(uint256 value) external {
        require(msg.sender == owner(), "Admin use only.");
        require(value <= 900, "available to 90%");
        EARLY_WITHDRAWAL_TAX = value;
    }

    function SET_COMPOUND_STEP(uint256 value) external {
        require(msg.sender == owner(), "Admin use only.");
        require(value <= 1_209_600, "available between 0 and 14 days");
        COMPOUND_STEP = value;
    }

    function SET_COMPOUND_FOR_NO_TAX_WITHDRAWAL(uint256 value) external {
        require(msg.sender == owner(), "Admin use only.");
        require(value <= 12);
        COMPOUND_FOR_NO_TAX_WITHDRAWAL = value;
    }
}