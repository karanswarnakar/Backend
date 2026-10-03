import React from "react";
import { Link } from "react-router";
import "./PageNotFound.scss";

const PageNotFound = () => {
    return (
        <main className="page-not-found">
            <div className="page-not-found__content">

                <div className="page-not-found__code">
                    404
                </div>

                <h1>
                    Page not found
                </h1>

                <p>
                    The page you're looking for doesn't exist
                    or may have been moved.
                </p>

                <Link
                    to="/"
                    className="btn-primary"
                >
                    Go back home
                </Link>

            </div>
        </main>
    );
};

export default PageNotFound;