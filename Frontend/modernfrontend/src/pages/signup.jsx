import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearAuthError, clearAuthState, signup } from "../redux/AllSlices";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, success } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    gender: "",
    password: "",
  });

  useEffect(() => {
    if (success) {
      dispatch(clearAuthState());
      navigate("/signin", {
        replace: true,
        state: { error: "Not sign in. Please sign in to continue." },
      });
    }
  }, [dispatch, navigate, success]);

  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
      dispatch(clearAuthState());
    };
  }, [dispatch]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(signup(formData));
  };

  const canvasRef = useRef(null);

  // Animated background effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 50;

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        radius: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }

    const animate = () => {
      // Clear canvas with semi-transparent black
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off walls
        if (
          particle.x - particle.radius < 0 ||
          particle.x + particle.radius > canvas.width
        ) {
          particle.vx = -particle.vx;
          particle.x = Math.max(
            particle.radius,
            Math.min(canvas.width - particle.radius, particle.x),
          );
        }
        if (
          particle.y - particle.radius < 0 ||
          particle.y + particle.radius > canvas.height
        ) {
          particle.vy = -particle.vy;
          particle.y = Math.max(
            particle.radius,
            Math.min(canvas.height - particle.radius, particle.y),
          );
        }

        // Draw particle
        ctx.fillStyle = `rgba(100, 150, 255, ${particle.opacity})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.strokeStyle = `rgba(100, 150, 255, ${0.2 * (1 - distance / 150)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-black overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
        style={{
          background:
            "radial-gradient(circle at 20% 50%, rgba(20, 40, 100, 0.3), transparent 50%), radial-gradient(circle at 80% 80%, rgba(20, 30, 60, 0.3), transparent 50%), #000000",
        }}
      />
      <div className="relative z-10 bg-gray-800 backdrop-blur-xl shadow-2xl rounded-2xl p-8 w-full max-w-md text-white">
        <h2 className="text-3xl font-extrabold text-center text-white mb-6">
          Create Account
        </h2>
        <p className="text-center text-white mb-6">Join us today!</p>
        {error && (
          <p className="mb-4 rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-700">
            {error}
          </p>
        )}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <label
              className="block text-white text-sm font-bold mb-2"
              htmlFor="name"
            >
              Full Name
            </label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="John Doe"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
            />
          </div>
          <div>
            <label
              className="block text-white text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
            />
          </div>
          <div>
            <label
              className="block text-white text-sm font-bold mb-2"
              htmlFor="gender"
            >
              Gender
            </label>

            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
            >
              <option value="" disabled className="text-white">
                Select Gender
              </option>
              <option value="male" className="text-white">
                Male
              </option>
              <option value="female" className="text-white">
                Female
              </option>
              <option value="other" className="text-white">
                Other
              </option>
            </select>
          </div>
          <div>
            <label
              className="block text-white text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="********"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300 shadow-md mt-2 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-white text-sm">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="text-blue-600 hover:underline font-semibold"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
