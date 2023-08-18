import React, { useState } from "react";
import { ethers } from "ethers";

export default function Form({ provider, ticketMaster }) {
  const [name, setName] = useState("");
  const [cost, setCost] = useState("");
  const [tickets, setTickets] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const tokens = (n) => {
    return ethers.parseUnits(n.toString(), "ether");
  };
  const NameHandler = (value) => {
    setName(value);
  };
  const CostHandler = (value) => {
    setCost(value);
  };
  const TicketsHandler = (value) => {
    setTickets(value);
  };
  const DateHandler = (value) => {
    setDate(value);
  };
  const TimeHandler = (value) => {
    setTime(value);
  };
  const LocationHandler = (value) => {
    setLocation(value);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    const month = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "July",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec",
    ];
    let d = new Date(date);
    let monthstr = month[d.getMonth()];
    let day = d.getDate();
    let currentDate = monthstr + " " + day;
    const NewEvent = {
      name: name,
      cost: tokens(cost),
      tickets: tickets,
      date: currentDate,
      time: time,
      location: location,
    };
    console.log(NewEvent)
    // NameHandler(" ");
    // CostHandler(0);
    // TicketsHandler("");
    // DateHandler("");
    // TimeHandler("");
    // LocationHandler("");
    const signer = await provider.getSigner();
    try {
      ticketMaster
        .connect(signer)
        .list(
          NewEvent.name,
          NewEvent.cost,
          NewEvent.tickects,
          NewEvent.date,
          NewEvent.time,
          NewEvent.location
        );
      console.log(ticketMaster);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <form onSubmit={submitHandler}>
      <div>
        <label>Event Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => NameHandler(e.target.value)}
        />
      </div>
      <div>
        <label>Cost:</label>
        <input
          type="text"
          value={cost}
          onChange={(e) => CostHandler(e.target.value)}
        />
      </div>

      <div>
        <label>Tickets available:</label>
        <input
          type="text"
          value={tickets}
          onChange={(e) => TicketsHandler(e.target.value)}
        />
      </div>

      <div>
        <label>Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => DateHandler(e.target.value)}
        />
      </div>
      <div>
        <label>Time:</label>
        <input
          type="time"
          value={time}
          onChange={(e) => TimeHandler(e.target.value)}
        />
      </div>
      <div>
        <label>Location:</label>
        <input
          type="text"
          value={location}
          onChange={(e) => LocationHandler(e.target.value)}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}
