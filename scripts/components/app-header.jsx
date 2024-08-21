class AppHeaderComponent {
  view() {
    return (
      <div className="app-header">
        <h1>Flip Book</h1>
        <div className="app-header-mentions">
          <span className="app-header-mention">
            By <a href="https://calebevans.me/">Caleb Evans</a>.
          </span>
          <span className="app-header-mention">For my friend and brother, Bill.</span>
        </div>
      </div>
    );
  }
}

export default AppHeaderComponent;
