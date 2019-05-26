import React, { Fragment, useState, useEffect, memo } from "react";
import axios from "axios";
import "./Home.css";

const Home = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");

  useEffect(() => {
    axios
      .get("/api/items/all")
      .then(res => setItems(res.data))
      .catch(err => console.log(err));

    console.log("re-render");
  }, []);

  let content = <p>Loading...</p>;

  if (items && items.length > 0) {
    content = items.map(item => (
      <div key={item.id} className="Card">
        <div onClick={() => onDeleteItemHandler(item.id)} className="X">
          X
        </div>
        <h2>{item.item_name}</h2>
        <h4>Price: ${item.price}</h4>
      </div>
    ));
  }

  const onItemSubmitHandler = e => {
    e.preventDefault();

    const formData = {
      name: itemName,
      price: itemPrice
    };

    axios
      .post("/api/items", formData)
      .then(res => {
        setItems(items.concat(res.data));
      })
      .catch(err => console.log(err));
  };

  const onSearchSubmitHandler = e => {
    e.preventDefault();

    axios
      .get(`/api/items/search?term=${search}`)
      .then(res => {
        setItems(res.data);
      })
      .catch(err => console.log(err));
  };

  const onDeleteItemHandler = id => {
    axios
      .delete(`/api/items/${id}`)
      .then(res => {
        setItems(items.filter(item => item.id !== id));
      })
      .catch(err => console.log(err));
  };

  return (
    <Fragment>
      <form onSubmit={onSearchSubmitHandler}>
        <label htmlFor="search">Search for Items </label>
        <input
          style={{ margin: "0 auto" }}
          type="text"
          name="search"
          required
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
      <form onSubmit={onItemSubmitHandler}>
        <label htmlFor="name">Add a New Item </label>
        <input
          style={{ margin: "0 auto" }}
          type="text"
          name="name"
          placeholder="name"
          required
          value={itemName}
          onChange={e => setItemName(e.target.value)}
        />
        <input
          style={{ margin: "0 auto" }}
          type="text"
          name="price"
          placeholder="price"
          required
          value={itemPrice}
          onChange={e => setItemPrice(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>

      {content}
    </Fragment>
  );
};

export default memo(Home);
