import { useEffect, useState } from "react";

function App() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [industryFilter, setIndustryFilter] = useState("");

  // Fetch data from mock API (public/companies.json)
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("/companies.json");
        if (!res.ok) {
          throw new Error("Failed to load company data");
        }

        const data = await res.json();
        setCompanies(data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  // Get unique locations and industries for dropdowns
  const locationOptions = Array.from(new Set(companies.map((c) => c.location)));
  const industryOptions = Array.from(new Set(companies.map((c) => c.industry)));

  // Apply search + filters
  const filteredCompanies = companies.filter((company) => {
    const matchesSearch = company.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesLocation =
      !locationFilter || company.location === locationFilter;

    const matchesIndustry =
      !industryFilter || company.industry === industryFilter;

    return matchesSearch && matchesLocation && matchesIndustry;
  });

  return (
    <div className="app">
      <header className="app-header">
        <h1>Companies Directory</h1>
        <p className="subtitle">
          Simple React app to browse companies with search and filters.
        </p>
      </header>

      <section className="filters">
        <div className="filter-item">
          <label>Search by name</label>
          <input
            type="text"
            placeholder="Type company name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-item">
          <label>Filter by location</label>
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          >
            <option value="">All locations</option>
            {locationOptions.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <label>Filter by industry</label>
          <select
            value={industryFilter}
            onChange={(e) => setIndustryFilter(e.target.value)}
          >
            <option value="">All industries</option>
            {industryOptions.map((ind) => (
              <option key={ind} value={ind}>
                {ind}
              </option>
            ))}
          </select>
        </div>
      </section>

      <main className="content">
        {loading && <p className="info">Loading companies...</p>}

        {error && !loading && <p className="error">Error: {error}</p>}

        {!loading && !error && filteredCompanies.length === 0 && (
          <p className="info">
            No companies match your filters. Try changing the search or filters.
          </p>
        )}

        {!loading && !error && filteredCompanies.length > 0 && (
          <table className="company-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Location</th>
                <th>Industry</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompanies.map((company) => (
                <tr key={company.id}>
                  <td>{company.name}</td>
                  <td>{company.location}</td>
                  <td>{company.industry}</td>
                  <td>{company.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}

export default App;
