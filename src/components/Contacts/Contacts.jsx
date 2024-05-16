import './Contacts.css'
import { useState, useEffect } from 'react';

const  Contacts = () => {
    const contactsHead = ["ID", "Name", "Phone Number"];
    const [ contacts, setContacts ]           = useState([]);
    const [ limContacts, setLimContacts ]     = useState([]);
    const [ totalContacts, setTotalContacts ] = useState(0);
    const [ page, setPage]                    = useState(1);

    const contactHandler = (min, max, contacts) => {
        setLimContacts(contacts.slice(min, max));
        console.log(limContacts)
    }
    const pageHandler = (page) => {
        const sum = 10;
        const minV = sum * (page - 1);
        const maxV = minV + (sum - 1);
        console.log(minV + " " + maxV);
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

    useEffect(() => {
      fetch('http://localhost:9000/contacts')
        .then(response => response.json())
        .then(response => {
        //   console.log(response);
            setContacts(response);
            setTotalContacts(response.length/10);
            contactHandler(0, 9, response);   
        })
        .catch(err => console.error(err));
    }, []);   

    const [filter, setFilter] = useState('');

    const filteredProducts = contacts.filter((contact) =>
      contact.name.toLowerCase().includes(filter.toLowerCase())
    );


    return (
      <div className='container'>
        <input className='table-filter' type="text" placeholder="Filter by name"
            value={filter} onChange={(e) => setFilter(e.target.value)}
        />
        <ul className='contacts-table-top table'>
            {contactsHead.map((contact, i) => <li key={i}>{contact}</li>)}
        </ul>
        {filter !== "" ? 
            <ul className='contacts-table'>
            {filteredProducts.map(contact => 
                <li key={contact.id}>
                    <p>{contact.id}</p>
                    <p>{contact.name}</p>
                    <p>{contact.mobile ? contact.mobile : <img className="block" src="src/assets/block.svg" alt="block" />}</p>
                </li>)}
            </ul> : 
            <ul className='contacts-table'>
                {limContacts.map(contact => 
                    <li key={contact.id}>
                        <p>{contact.id}</p>
                        <p>{contact.name}</p>
                        <p>{contact.mobile ? contact.mobile : <img className="block" src="src/assets/block.svg" alt="block" />}</p>
                    </li>)}
            </ul>}

        <ul className='pages'>
            <div onClick={prev.bind()} className={`arrow ${page === 1 || filter !== "" ? 'inactiveArrow' : ""}`} >
                <img src="src/assets/arrowLeft.svg" alt="arrow-previous" />
            </div>
            {/* <ul className='pages-container'>
                {limContacts.map((contact, i) => <li key={i} className='arrow page' onClick={pageHandler}>{i + page}</li>)}
            </ul> */}
            <div onClick={next.bind()} className={`arrow ${page === totalContacts || filter !== "" ? 'inactiveArrow' : ""}`}>
                <img src="src/assets/arrowRight.svg" alt="arrow-next" />
            </div>
        </ul>
      </div>
    )
}

export default Contacts