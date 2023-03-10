import * as config from '../util/config.js';
import { getCookie, deleteAllCookies } from '../util/cookie.js';
import { formatTitle, formatTimestamp } from '../util/formatting.js';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import '../styles/header.css';

const AccountMenu = (props) => {
    return (
        <div id="account" className="menuDropdown">
            <div className="menuDropdownContents">
                <div id="topMenuItem" className="textLink menuDropdownItem">
                    Profile
                </div>
                <div className="textLink menuDropdownItem" onClick={ props.logoutClick }>
                    Log out
                </div>
            </div>
        </div>
    );
};

export const Header = (props) => {
    const navigate = useNavigate();
    const navbar = useRef();

    const [merged, setMerged] = useState(false);
    const [titleStyle, setTitleStyle] = useState({
        transform: 'translateY(10px)',
        opacity: '0',
    });

    const logoutClick = () => {
        fetch(`${config.API_ROOT}logout/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${getCookie('auth_token')}`,
            },
        }).then(res => {
            props.reset();
            deleteAllCookies();
            console.log(document.cookie);
            navigate('/');
        });
    };

    const getProp = (element, prop) => {
        return getComputedStyle(element).getPropertyValue(prop);
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const scrollHandler = (e) => {
        if (navbar.current) {
            const fontSize = parseInt(getProp(navbar.current, '--navbar-font-size'));

            const heightEm = parseInt(getProp(navbar.current, '--navbar-height'));
            const marginEm = parseInt(getProp(navbar.current, '--navbar-margin'));

            const threshold = fontSize*heightEm*0.5 + fontSize*marginEm;

            if (window.pageYOffset > threshold) {
                setMerged(true);
                setTitleStyle({
                    transform: 'translateY(0px)',
                    opacity: '1',
                });
            }
            else if (window.pageYOffset < threshold) {
                setMerged(false);
                setTitleStyle({
                    transform: 'translateY(10px)',
                    opacity: '0',
                });
            }
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', scrollHandler);

        return () => window.removeEventListener('scroll', scrollHandler);
    }, []);

    const logoClick = () => {
        navigate(0);
    }

    const menuProps = {
        logoutClick: logoutClick,
    };

    const pageTitle = typeof props.viewing === 'string' ? formatTitle(props.viewing) : props.viewing;

    return (
        <>
            <div className="fixed">
                <div className="headerBackground">
                    <div className="header">
                        <div className="logo" onClick={ logoClick }>Eidetic</div>
                        <div style={ titleStyle } className="headerOption pageTitle" onClick={ scrollToTop }>
                                <div className="textLink">
                                    { pageTitle }
                                </div>
                        </div>
                        <div className="headerOption">
                            <span className="textLink">Account</span>
                            <AccountMenu { ...menuProps } />
                        </div>
                    </div>
                </div>
                <div className="fauxHeader" />
            </div>
            <div ref={ navbar } className="navbar">
                { props.goBack ? props.goBack : pageTitle }
            </div>
        </>
    );
}
