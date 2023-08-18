import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

//Components
import Navigation from "./components/Navigation";
import Card from "./components/Card";
import Sort from "./components/Sort";
import SeatChart from "./components/SeatChart";
import Withdraw from "./components/Withdraw";
import Form from "./components/Form";
//ABIs
import abi from "./constants/TicketMaster.json";

//Address
import config from "./constants/networkMapping.json";

export default function App() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [ticketMaster, setTicketMaster] = useState(null);
  const [occasions, setOccasions] = useState([]);
  const [maxOccasions, setMaxOccasions] = useState(0);
  const [occasion, setOccasion] = useState({});
  const [toggle, setToggle] = useState(false);
  const [owner, setOwner] = useState(null);
  const [balanceOf, setBalanceOf] = useState(0);
  const AddNewEvent = async (event) => {
    // console.log(event);
    const buyer = await provider.getSigner();
    const transaction = await ticketMaster
      .connect(buyer)
      .list(
        event.name,
        event.cost,
        event.tickects,
        event.date,
        event.time,
        event.location
      );
    await transaction.wait();
    console.log("EVENT ADDED");
  };
  const ConnectContract = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    setProvider(provider);
    const chain = await window.ethereum.request({ method: "eth_chainId" });
    const contractAddress = config[parseInt(chain)]["TicketMaster"][0];
    // const contract = new ethers.Contract(contractAddress, abi, provider);
    const contract = new ethers.Contract(contractAddress, abi, provider);
    setTicketMaster(contract);
    const numberOfOccasions = await contract.totalOccasions();
    console.log(numberOfOccasions.toString());
    setMaxOccasions(parseInt(numberOfOccasions.toString()));
    const dep = await contract.owner();
    setOwner(dep);
    let Balance = (await provider.getBalance(contractAddress)).toString();
    console.log(Balance);
    setBalanceOf(parseInt(Balance));
  };
  const CollectOccasions = async () => {
    let totalEvent = [];
    if (maxOccasions == 0) console.log("zero");
    for (let i = 1; i <= maxOccasions; i++) {
      const event = await ticketMaster.getOccasions(i);
      totalEvent.push(event);
    }
    setOccasions(totalEvent);
    console.log(occasions);
  };
  const loadBlockchainData = async () => {
    // Fetch Account and refresh account
    window.ethereum.on("accountsChanged", async () => {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
    });
  };
  useEffect(() => {
    loadBlockchainData();
    ConnectContract();
    CollectOccasions();
  }, [occasions.length == 0 && account != null]);
  return (
    <div>
      <header>
        <Navigation account={account} setAccount={setAccount} />
        <h2 className="header__title">
          <strong>Event</strong>Tickets
        </h2>
      </header>
      {owner != account ? (
        <div>
          <Sort />
          <div className="cards">
            {occasions.map((occasion, index) => (
              <Card
                occasion={occasion}
                id={index + 1}
                ticketMaster={ticketMaster}
                provider={provider}
                account={account}
                toggle={toggle}
                setToggle={setToggle}
                setOccasion={setOccasion}
                key={index}
              />
            ))}
          </div>
          {toggle && (
            <SeatChart
              occasion={occasion}
              ticketMaster={ticketMaster}
              provider={provider}
              setToggle={setToggle}
            />
          )}
        </div>
      ) : (
        <div>
          <Form provider={provider} ticketMaster={ticketMaster} />
          <Withdraw
            ticketMaster={ticketMaster}
            provider={provider}
            balance={balanceOf}
          />
        </div>
      )}
    </div>
  );
}
