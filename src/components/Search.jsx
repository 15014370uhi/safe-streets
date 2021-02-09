import Fire from '../firebase';
import Button from 'react-bootstrap/Button';


const Search = () => {

const logout = () => {
    Fire.auth().signOut();
}

    return (
        <div>            
            <Button type="submit" onClick={logout} className="btn btn-danger">Logout</Button>
            Search Page
        </div>
    )
}

export default Search;