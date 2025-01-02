import React from 'react';
import { Link } from 'react-router-dom';

const Head = () => {
    return (
        <>
            <section className="head">
                <div className="container flexSB paddingTB">
                    <div className="logo">
                        <Link to="/">
                            <img src="../images/LMTextLogo.png" alt="Home" />
                        </Link>
                    </div>
                    {/* <div className="ad">
                        <img src="../images/headerb.png" alt="" />
                    </div> */}
                </div>
            </section>
        </>
    );
};

export default Head;
