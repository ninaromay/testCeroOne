import './Contacts.css'
import { useState, useEffect } from 'react';

const  Contacts = () => {
    // Contacts headers
    const contactsHead = ["ID", "Name", "Phone Number"];
    // All contacts
    const [ contacts, setContacts ]           = useState([]);
    // Page contacts
    const [ limContacts, setLimContacts ]     = useState([]);
    // Total pages
    const [ totalContacts, setTotalContacts ] = useState(0);
    // Current page
    const [ page, setPage]                    = useState(1);

    // Contact handlers to limit per page
    const contactHandler = (min, max, contacts) => {
        setLimContacts(contacts.slice(min, max));
    }
    // Page handlers
    const pageHandler = (page) => {
        // Amount of contacts by page
        const sum = 10;
        // Min number calculation
        const minV = sum * (page - 1);
        // Max number calculation
        const maxV = minV + (sum - 1);
        contactHandler(minV, maxV, contacts);
    }
    const prev = () => {
        console.log("prev")
        if(page >= 1){
            setPage(page - 1);
            pageHandler(page - 1);
        }
    }
    const next = () => {
        if(page < totalContacts){
            setPage(page + 1);
            pageHandler(page + 1);
        }
    }

    // Call to the API (ExpressJs)
    useEffect(() => {
      fetch('http://localhost:9000/contacts')
        .then(response => response.json())
        .then(response => {
            setContacts(response);
            setTotalContacts(response.length/10);
            contactHandler(0, 9, response);   
        })
        .catch(err => console.error(err));
    }, []);   

    // Filter by name logic
    const [filter, setFilter] = useState('');
    // Contacts Filtered
    const filteredContacts = contacts.filter((contact) =>
      contact.name.toLowerCase().includes(filter.toLowerCase())
    );

    return (
      <div className='container'>
        {/* Contacts Filter */}
        <input className='table-filter' type="text" placeholder="Filter by name"
            value={filter} onChange={(e) => setFilter(e.target.value)}
        />

        {/* Table Top */}
        <ul className='contacts-table-top table'>
            {contactsHead.map((contact, i) => <li key={i}>{contact}</li>)}
        </ul>

        {   filter !== "" ? 
            /* Table filtered by name */
            <ul className='contacts-table'>
            {filteredContacts.map(contact => 
                <li key={contact.id}>
                    <p>{contact.id}</p>
                    <p>{contact.name}</p>
                    <p>{contact.mobile ? contact.mobile : <img className="block" src="src/assets/block.svg" alt="block" />}</p>
                </li>)}
            </ul>
            :
            /* Table with all */
            <ul className='contacts-table'>
                {limContacts.map(contact => 
                    <li key={contact.id}>
                        <p>{contact.id}</p>
                        <p>{contact.name}</p>
                        <p>{contact.mobile ? contact.mobile : <img className="block" src="src/assets/block.svg" alt="block" />}</p>
                    </li>)}
            </ul>}

        {/* Table no matches found */}
        {   filteredContacts.length === 0  ? <ul className='contacts-table'><li><p>No matches found</p></li></ul> : ''}

        {/* <- Pages -> */}
        <ul className='pages'>
            <div onClick={prev.bind()} className={`arrow ${page === 1 || filter !== "" ? 'inactiveArrow' : ""}`} >
                <img src="src/assets/arrowLeft.svg" alt="arrow-previous" />
            </div>
            <div onClick={next.bind()} className={`arrow ${page === totalContacts || filter !== "" ? 'inactiveArrow' : ""}`}>
                <img src="src/assets/arrowRight.svg" alt="arrow-next" />
            </div>
        </ul>
      </div>
    )
}

export default Contacts