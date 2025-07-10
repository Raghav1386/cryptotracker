import { createContext, useState, useEffect } from "react";

export const CryptoContext = createContext();

const CryptoContextProvider = (props) => {
  const [cryptoList, setCryptoList] = useState([]);
  const [filteredcoins, setFilteredcoins] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentCurrency, setCurrentCurrency] = useState({
    name: "usd",
    symbol: "$", // ✅ lowercase 'symbol'
  });

  // Fetch crypto data from CoinGecko
  const fetchCryptoData = async () => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-cg-demo-api-key": "CG-3gMsTT9dNDJ3VBKPfEVzGKPP",
      },
    };
    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currentCurrency.name}`,
        options
      );
      const data = await res.json();
      setCryptoList(data);
    } catch (err) {
      console.error("Failed to fetch crypto data:", err);
    }
  };

  // Refetch when currency changes
  useEffect(() => {
    fetchCryptoData();
  }, [currentCurrency]);

  // Refilter when crypto list or search term changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredcoins(cryptoList);
    } else {
      const filtered = cryptoList.filter((coin) =>
        coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredcoins(filtered);
    }
  }, [cryptoList, searchTerm]);

  const contextValue = {
    cryptoList,
    filteredcoins,
    currentCurrency,
    setCurrentCurrency,
    searchTerm,
    setSearchTerm,
  };

  return (
    <CryptoContext.Provider value={contextValue}>
      {props.children}
    </CryptoContext.Provider>
  );
};

export default CryptoContextProvider;
