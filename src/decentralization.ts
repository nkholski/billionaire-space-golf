import { SpaceText } from "./text";
declare let nearApi: any;

let contract: any;
let walletConnection: any;
let near: any;
let nearConfig: any;
let games: any;

export const isSignedIn = () => !!walletConnection?.isSignedIn();

export const getGames = () => games;

export const InitNear = async () => {
  nearConfig = {
    networkId: "testnet",
    nodeUrl: "https://rpc.testnet.near.org",
    contractName: "sg.testnet",
    walletUrl: "https://wallet.testnet.near.org",
    helperUrl: "https://helper.testnet.near.org",
    //@ts-ignore
    keyStore: new window.nearApi.keyStores.BrowserLocalStorageKeyStore(
      window.localStorage,
      "sg.testnet"
    ),
  };
  near = await nearApi.connect(nearConfig);
  walletConnection = new nearApi.WalletConnection(
    near,
    "Billionaire Space Golf"
  );
  if (walletConnection.isSignedIn()) {
    makeContract();
  }
};

export const loginNear = async () => {
  walletConnection.requestSignIn(
    nearConfig.contractName,
    "Billionaire Space Golf"
  );
};

const makeContract = async () => {
  contract = await new nearApi.Contract(
    walletConnection.account(),
    nearConfig.contractName,
    {
      // View methods are read-only – they don't modify the state, but usually return some value
      viewMethods: ["getGames"],
      // Change methods can modify the state, but you don't receive the returned value when called
      changeMethods: ["addGame"],
      // Sender is the account ID to initialize transactions.
      // getAccountId() will return empty string if user is still unauthorized
      sender: walletConnection.getAccountId(),
    }
  );
  contract.getGames().then((messages) => {
    games = messages
      .filter((m) => m.sender != walletConnection.getAccountId())
      .reverse();
  });
};

export const sendGame = async (s, l) => {
  //debugger;
  if (!isSignedIn()) {
    return;
  }
  contract
    .addGame({
      text:
        s +
        "!" +
        l +
        "!" +
        new Date()
          .toISOString()
          .replace("T", " ")
          .substring(5)
          .substring(0, 11),
    })
    .then(() => {
      contract.getGames().then((messages) => {
        games = messages
          .filter((m) => m.sender != walletConnection.getAccountId())
          .reverse();
      });
    });
};

export const viewLatest = () => {};

InitNear();

export const GlobalGames = () => {
  SpaceText();
};
