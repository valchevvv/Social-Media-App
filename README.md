<h1>Social Media App</h1>

<p>This is a simple social media application built with a React TypeScript front-end and an Express TypeScript back-end, using MongoDB as a database.</p>

<h2>Features</h2>
<ul>
  <li>User authentication (Sign up, Sign in)</li>
  <li>Post creation</li>
  <li>Commenting on posts</li>
  <li>Messaging</li>
  <li>Post liking</li>
  <li>Exploring posts</li>
  <li>Follow users</li>
  <li>User profiles</li>
</ul>

<h2>Technologies Used</h2>
<ul>
  <li><strong>front-end:</strong> React, TypeScript, Tailwind CSS</li>
  <li><strong>back-end:</strong> Express, TypeScript, MongoDB</li>
  <li><strong>Database:</strong> MongoDB</li>
</ul>

<h2>Prerequisites</h2>
<p>Before you begin, ensure you have the following installed:</p>
<ul>
  <li>Node.js (v20+)</li>
  <li>npm</li>
  <li>MongoDB (optional)</li>
</ul>

<h2>Getting Started</h2>

<h3>Clone the Repository</h3>
<pre><code>git clone https://github.com/valchevvv/Social-Media-App.git
cd Social-Media-App
</code></pre>

<h3>back-end Setup</h3>
<ol>
  <li><strong>Navigate to the back-end directory:</strong>
    <pre><code>cd back-end</code></pre>
  </li>
  <li><strong>Install dependencies:</strong>
    <pre><code>npm install</code></pre>
  </li>
  <li><strong>Environment Variables:</strong>
    <p>Create a <code>.env</code> file in the <code>back-end</code> directory and add the following variables:</p>
    <pre><code>
MONGO_URI=mongodb://localhost:27017/social-media-app #for example
PORT=
SOCKET_IO_PORT=
JWT_SECRET=
</code></pre>
  </li>
  <li><strong>Run the back-end server:</strong>
    <pre><code>npm run dev</code></pre>
    <p>The API server should now be running on <code>http://localhost:5000</code>.</p>
    <p>The Socket IO server should now be running on <code>http://localhost:5001</code>.</p>
  </li>
</ol>

<h3>front-end Setup</h3>
<ol>
  <li><strong>Navigate to the front-end directory:</strong>
    <pre><code>cd ../front-end</code></pre>
  </li>
  <li><strong>Install dependencies:</strong>
    <pre><code>npm install</code></pre>
  </li>
  <li><strong>Environment Variables:</strong>
    <p>Create a <code>.env</code> file in the <code>front-end</code> directory and add the following variables:</p>
    <pre><code>VITE_BASE_URL=http://your-ip:your-back-end-PORT/api
VITE_SOCKET_URL=http://your-ip:your-back-end-SOCKET-IO-PORT/
</code></pre>
  </li>
  <li><strong>Run the front-end application:</strong>
    <pre><code>npm run preview</code></pre>
    <p>The front-end should now be running on <code>http://localhost:4173</code>.</p>
  </li>
</ol>

<h2>Running the App</h2>
<p>Once both the back-end and front-end are running, you can access the application by navigating to <code>http://localhost:4173</code> in your browser.</p>

<h2>Project Structure</h2>
<ul>
  <li><strong>back-end/</strong>: Contains the Express server setup, routes, controllers, services, and MongoDB models.</li>
  <li><strong>front-end/</strong>: Contains the React application with components, pages, and Tailwind CSS setup.</li>
</ul>

<h2>Available Scripts</h2>

<h3>back-end Scripts</h3>
<ul>
  <li><code>npm run dev</code>: Runs the back-end server in development mode with hot-reloading.</li>
  <li><code>npm run build</code>: Builds the back-end for production.</li>
</ul>

<h3>front-end Scripts</h3>
<ul>
  <li><code>npm run dev</code>: Runs the front-end in development mode.</li>
  <li><code>npm run build</code>: Builds the front-end for production.</li>
</ul>

<h2>License</h2>
<p>This project is licensed under the MIT License - see the <a href="LICENSE">LICENSE</a> file for details.</p>

<h2>Contributing</h2>
<p>Contributions are welcome! Please feel free to submit a Pull Request.</p>

<h2>Contact</h2>
<p>If you have any questions, feel free to contact me at <a href="mailto:dvalchevvv@gmail.com">dvalchevvv@gmail.com</a>.</p>
