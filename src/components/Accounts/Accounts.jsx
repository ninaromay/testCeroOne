import './Accounts.css'
import { useState, useEffect } from 'react';

const  Accounts = () => {
    // Head values
    const accountsHead = ["ID", "Account Name", "Account Number"];
    // All Accounts 
    const [accounts, setAccounts]             = useState([]);
    // Accounts contained by page
    const [ limAccounts, setLimAccounts ]     = useState([]);
    // Number of pages
    const [ totalAccounts, setTotalAccounts ] = useState(0);
    // Current page, set to page 1 to start
    const [ page, setPage]                    = useState(1);

    // Accounts limited by page handler
    const accountHandler = (min, max, accounts) => {
        setLimAccounts(accounts.slice(min, max));
    }
    // Page handlers
    const pageHandler = (page) => {
        // Amount of accounts by page
        const sum = 8;
        // Min number calculation
        const minV = sum * (page - 1);
        // Max number calculation
        const maxV = minV + (sum - 1);
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

    // Call to the API (ExpressJs)
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

    // Filter by name logic
    const [ filter, setFilter ] = useState('');
    // Accounts filtered
    const filteredByName = accounts.filter((account) =>
      account.name.toLowerCase().includes(filter.toLowerCase())
    );
    
    // Filter by 2 or 4 numbers
    const [ filterAccount, setFilterAccount ] = useState('');
    // Accounts filtered
    const [ filteredAccounts, setFilteredAccounts ] = useState([]);
    const changeHandler = (e) => {
        setFilterAccount(e);
        // Filter by 2 numbers
        if(e.length === 2){
            const opFil = accounts.filter((account) =>
                account.accountNum.toString().startsWith(e.toString()));
            setFilteredAccounts(opFil);
    
        }   // Filter by  4 numbers
            else if(e.length === 4){
            const opFil = accounts.filter((account) =>
                account.accountNum.toString().startsWith(e.toString()));
            setFilteredAccounts(opFil);
        }
    }

    // Range filter
    const [ rangeMin, setRangeMin ] = useState('');
    const [ rangeMax, setRangeMax ] = useState('');
    const [ rangeAccounts, setRangeAccounts ] = useState([]);
    const [ submit, setSubmit ] = useState(false);
    const [ error, setError ] = useState('No matches');

    const rangeHandler = (min, max) => {
        // Control that range is the right value for both inputs (set to min 8 numbers)
        if(rangeMin.length >=8 && rangeMax.length >= 8){
            // Control that Start range is lower than End range
            if(rangeMin > rangeMax){
                setError('Start number cannot be bigger than End number');
            } // If the values are the same, return that account
            else if (rangeMin > rangeMax) {
                setRangeAccounts(accounts[rangeMin]);
            } // Filter accounts that match any number between Start and End
            else {
                var ranFil = [];
                for (var i = rangeMin; i <= rangeMax; i++) {
                    const fil = accounts.filter((account) =>
                        account.accountNum.toString().startsWith(i.toString()));
                    ranFil.push(fil[0])
                    console.log(ranFil);
                }
                setRangeAccounts(ranFil);
                setSubmit(!submit);
            }
        } // Handle errors
        else {
            setRangeAccounts([]);
            setSubmit(!submit);
            if(rangeMin > rangeMax){
                setError('Range Start number cannot be bigger than End number');
            } else {
                setError('Verify that you use at least 8 numbers');
            }
        }
    }
    
  return (
    <div className='container'>
        {/* Account Filters */}
        <div className='filter-container'>
            {/* Name filter */}
            <input className='accounts-table-filter' type="text" placeholder="Filter by name"
                value={filter} onChange={(e) => setFilter(e.target.value)} />
            {/* Account Filter by 2 or 4 numbers */}
            <input className='accounts-table-filter' type="number" placeholder="Filter by account"
                value={filterAccount} onChange={(e) => changeHandler(e.target.value)} />
            <div className='filter-container'>
                <p>Range:</p>
                <input className='accounts-table-filter2' type="number" placeholder="Start"
                value={rangeMin} onChange={(e) => setRangeMin(e.target.value.toString())} />
                <input className='accounts-table-filter2' type="number" placeholder="End"
                value={rangeMax} onChange={(e) => setRangeMax(e.target.value.toString())} />
                <div className='filter-range-submit' onClick={() => rangeHandler(rangeMin, rangeMax)}>Submit</div>
            </div>
        </div>

        {/* Table Top */}
        <ul className='accounts-table-top table'>
            {accountsHead.map((account, i) => <li key={i}>{account}</li>)}
        </ul>

        {/* Table with all */}
        {   (filter === '' && filterAccount.length < 2 && !submit) ?
            <ul className='accounts-table'>
                    {limAccounts.map(account => 
                        <li key={account.id}>
                            <p>{account.id}</p>
                            <p>{account.name}</p>
                            <p>{account.accountNum}</p>
                        </li>)}
            </ul> :  ''}

        {/* Table filtered by name */}
        {   (filter !== '' && filterAccount.length === 0 && !submit) ? 
            <ul className='accounts-table'>
                {filteredByName.map(account => 
                    <li key={account.id}>
                        <p>{account.id}</p>
                        <p>{account.name}</p>
                        <p>{account.accountNum}</p>
                    </li>)}
            </ul> : ''}

        {/* Table filtered by 2 or 4 numbers */}
        {   (filter === '' && filterAccount.length >= 2 && !submit) ? 
            <ul className='accounts-table'>
                {filteredAccounts.map(account => 
                    <li key={account.id}>
                        <p>{account.id}</p>
                        <p>{account.name}</p>
                        <p>{account.accountNum}</p>
                    </li>)}
            </ul> : ''}

        {/* Table filtered depending on a range with Start number and End */}
        {   (filter === '' && filterAccount.length === 0 && submit) ? 
            <ul className='accounts-table'>
                {rangeAccounts.map(account => 
                    <li key={account.id}>
                        <p>{account.id}</p>
                        <p>{account.name}</p>
                        <p>{account.accountNum}</p>
                    </li>)}
        </ul> : ''}

        {/* Table no matches found */}
        {   filteredByName.length === 0  ||  (filterAccount.length >= 2 && filteredAccounts.length === 0) || (rangeMin.length >=8 && rangeMax.length >= 8 && rangeAccounts.length === 0 && submit) ? <ul className='accounts-table'><li><p>No matches found</p></li></ul> : ''}
        {   (rangeMin.length < 8 || rangeMax.length < 8) && submit ? <ul className='accounts-table'><li><p>{error}</p></li></ul> : ''}

        {/* <- Pages -> */}
         <ul className='pages'>
            <div onClick={prev.bind()} className={`arrow ${page === 1 || filter !== "" || filteredByName.length !== 0  || filterAccount.length >= 2 ? 'inactiveArrow' : ""}`} >
                <img src="src/assets/arrowLeft.svg" alt="arrow-previous" />
            </div>

            <div onClick={next.bind()} className={`arrow ${page === totalAccounts || filter !== "" || filteredByName.length !== 0  || filterAccount.length >= 2 ? 'inactiveArrow' : ""}`}>
                <img src="src/assets/arrowRight.svg" alt="arrow-next" />
            </div>
        </ul>
    </div>
  )
}

export default Accounts