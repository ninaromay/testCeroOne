import './Accounts.css'
import { useState, useEffect } from 'react';

const  Accounts = () => {
    const accountsHead = ["ID", "Account Name", "Account Number"];
    const [accounts, setAccounts]             = useState([])
    const [ limAccounts, setLimAccounts ]     = useState([]);
    const [ totalAccounts, setTotalAccounts ] = useState(0);
    const [ page, setPage]                    = useState(1);

    const accountHandler = (min, max, accounts) => {
        setLimAccounts(accounts.slice(min, max));
        console.log(limAccounts)
    }
    const pageHandler = (page) => {
        const sum = 8;
        const minV = sum * (page - 1);
        const maxV = minV + (sum - 1);
        console.log(minV + " " + maxV);
        accountHandler(minV, maxV, accounts);
    }
    const prev = () => {
        if(page >= 1){
            setPage(page - 1);
            pageHandler(page - 1);
        }
    }
    const next = () => {
        if(page < totalAccounts){
            setPage(page + 1);
            pageHandler(page + 1);
        }
    }

    useEffect(() => {
        fetch('http://localhost:9000/accounts')
            .then(response => response.json())
            .then(response => {
              setAccounts(response);
              setTotalAccounts(response.length/8);
              accountHandler(0, 7, response); 
            })
            .catch(err => console.error(err));
    }, []);

    const [filter, setFilter] = useState('');

    const filteredProducts = accounts.filter((account) =>
      account.name.toLowerCase().includes(filter.toLowerCase())
    );
    
  return (
    <div className='container'>
        <input className='table-filter' type="text" placeholder="Filter by name"
            value={filter} onChange={(e) => setFilter(e.target.value)}
        />
        <ul className='accounts-table-top table'>
            {accountsHead.map((account, i) => <li key={i}>{account}</li>)}
        </ul>
            {filter === '' ?
            <ul className='accounts-table'>
                {limAccounts.map(account => 
                    <li key={account.id}>
                        <p>{account.id}</p>
                        <p>{account.name}</p>
                        <p>{account.accountNum}</p>
                    </li>)}
            </ul> : 
            <ul className='accounts-table'>
            {filteredProducts.map(account => 
                <li key={account.id}>
                    <p>{account.id}</p>
                    <p>{account.name}</p>
                    <p>{account.accountNum}</p>
                </li>)}
            </ul>}
         <ul className='pages'>
            <div onClick={prev.bind()} className={`arrow ${page === 1 || filter !== "" ? 'inactiveArrow' : ""}`} >
                <img src="src/assets/arrowLeft.svg" alt="arrow-previous" />
            </div>

            <div onClick={next.bind()} className={`arrow ${page === totalAccounts || filter !== "" ? 'inactiveArrow' : ""}`}>
                <img src="src/assets/arrowRight.svg" alt="arrow-next" />
            </div>
        </ul>
    </div>
  )
}

export default Accounts