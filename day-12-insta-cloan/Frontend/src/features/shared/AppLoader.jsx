import "./app-loader.scss";

const AppLoader = () => (
    <main className="app-loader" role="status" aria-label="Loading Socially">
        <div className="app-loader__content">
            <div className="app-loader__mark" aria-hidden="true">
                <span />
                <span />
                <span />
            </div>
            <span className="app-loader__brand">Socially</span>
            <span className="app-loader__message">Getting things ready</span>
        </div>
    </main>
);

export default AppLoader;
