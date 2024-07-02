// src/App.js
import React, { useEffect, useState } from "react";
import Web3 from "web3";
import Voting from "./contracts/Voting.json";

const App = () => {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    const init = async () => {
      const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
      const accounts = await web3.eth.requestAccounts();
      setAccount(accounts[0]);

      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Voting.networks[networkId];
      const instance = new web3.eth.Contract(Voting.abi, deployedNetwork && deployedNetwork.address);
      setContract(instance);

      const candidateCount = await instance.methods.candidatesCount().call();
      const candidateList = [];
      for (let i = 1; i <= candidateCount; i++) {
        const candidate = await instance.methods.candidates(i).call();
        candidateList.push(candidate);
      }
      setCandidates(candidateList);
    };
    init();
  }, []);

  const vote = async (candidateId) => {
    await contract.methods.vote(candidateId).send({ from: account });
    setHasVoted(true);
  };

  return (
    <div>
      <h1>Decentralized Voting System</h1>
      <p>Your account: {account}</p>
      <ul>
        {candidates.map((candidate) => (
          <li key={candidate.id}>
            {candidate.name} - {candidate.voteCount} votes
            <button onClick={() => vote(candidate.id)} disabled={hasVoted}>
              Vote
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
