import React, * as react from 'react';
import { Grid, ListItem } from '@material-ui/core';
import { Link } from 'react-router-dom';
import './NavBar.style.css';

const Dropdown = ({ callbackFromParent }) => {
	const node = react.useRef();
	const handleClick = (e) => {
		if (node.current.contains(e.target)) {
			// inside click
			callbackFromParent(true);
			return;
		}
		// outside click
		callbackFromParent(false);
	};

	react.useEffect(() => {
		document.addEventListener('mousedown', handleClick);
		return () => {
			document.removeEventListener('mousedown', handleClick);
		};
	}, []);

	return (
		<Grid container ref={node}>
			<Grid item xs={12} sm={4} md={4}>
				<h4>Web Dev</h4>
				<ListItem onClick={() => callbackFromParent(false)}>
					<Link to="/d3-world-map">D3 World Map</Link>
				</ListItem>
				<ListItem>Keppler</ListItem>
				<ListItem>P5.js</ListItem>
				<ListItem>Gatsby</ListItem>
				<ListItem>GraphQL</ListItem>
			</Grid>
			<Grid item xs={12} sm={4} md={4}>
				<h4>Data Science</h4>
				<ListItem>Data mining</ListItem>
				<ListItem>Big Data and AI</ListItem>
				<ListItem>Django web app</ListItem>
				<ListItem>Kaggle Challenge</ListItem>
			</Grid>
			<Grid item xs={12} sm={4} md={4}>
				<h4>Design</h4>
				<ListItem>Posters</ListItem>
				<ListItem>Sketch</ListItem>
				<ListItem>Videos</ListItem>
			</Grid>
		</Grid>
	);
};

const NavBar = () => {
	const [listOpen, setListOpen] = react.useState(false);

	const myCallback = (listOpen) => {
		setListOpen(listOpen);
	};

	return (
		<Grid container className="navbar">
			<Grid item xs={12} sm={12} md={4} lg={4}>
				<Link to="/">
					<img className="logo" src={process.env.PUBLIC_URL + '/logo.png'} alt="Logo" />
				</Link>
			</Grid>
			<Grid item xs={12} sm={12} md={8} lg={8}></Grid>
			<ul>
				<li onClick={() => setListOpen(!listOpen)}>Projects</li>
				<li onClick={() => setListOpen(false)}>
					<Link to="/blog">Blog</Link>
				</li>
				<li onClick={() => setListOpen(false)}>
					<Link to="/skills">Skills</Link>
				</li>
				<li onClick={() => setListOpen(false)}>
					<Link to="/story">Story</Link>
				</li>
			</ul>
			<div className="dropdown">{listOpen ? <Dropdown callbackFromParent={myCallback} /> : null}</div>
		</Grid>
	);
};
export default NavBar;
