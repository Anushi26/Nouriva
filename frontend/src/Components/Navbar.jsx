import React, { useContext } from "react";
import { AuthContext } from "../Provider/AuthProvider";
import { Link, NavLink } from "react-router";
import Loading from "../Pages/Loading";
import logo from "/logo.png";

const links = [
  ["Home","/home"],
  ["Fridge","/home/fridge"],
  ["Share Food","/home/share-food"],
  ["Surplus","/home/surplus"],
  ["Requests","/home/requests"],
  ["Recipes","/home/recipes"],
  ["Impact","/home/impact"]
];

const Navbar = () => {
  const { user, logoutUser, loading } = useContext(AuthContext);
  if (loading) return <Loading />;
  const NavItem = ({name,to}) => <NavLink to={to} className={({isActive})=>isActive?"font-semibold text-[#a8b324]":"text-white hover:text-[#d8e57b]"}>{name}</NavLink>;
  return <div className="bg-[#0a472e] sticky top-0 z-50 shadow-lg font-roboto">
    <div className="w-11/12 mx-auto flex justify-between items-center min-h-16">
      <Link to="/home" className="flex items-center gap-2 text-white text-2xl font-bold shrink-0">
        <img className="w-10 h-10 object-contain" src={logo} alt="Nouriva"/>
        Nouriva
      </Link>
      <div className="hidden xl:flex items-center gap-5 text-sm">
        {links.map(([n,t])=><NavItem key={t} name={n} to={t}/>)}
      </div>
      <div className="flex items-center gap-3">
        {user ? <>
          <Link to="/home/profile" className="hidden md:block text-white text-sm hover:text-lime-200">{user.displayName||"Profile"}</Link><Link to="/home/addFood" className="hidden md:block text-white text-sm hover:text-lime-200">+ Food</Link>{user.role==="admin"&&<Link to="/home/admin" className="hidden md:block text-white text-sm hover:text-lime-200">Admin</Link>}
          <button onClick={logoutUser} className="border border-[#a8b324] text-[#a8b324] hover:bg-[#a8b324] hover:text-[#0a472e] px-5 py-2 rounded-full text-sm">Logout</button>
          <div className="dropdown xl:hidden"><div tabIndex={0} role="button" className="btn btn-ghost text-white">☰</div><ul tabIndex={0} className="menu dropdown-content right-0 mt-3 w-56 bg-white rounded-box p-3 shadow z-20">{links.map(([n,t])=><li key={t}><Link to={t}>{n}</Link></li>)}<li><Link to="/home/addFood">Add Food</Link></li><li><Link to="/home/myItems">My Items</Link></li><li><Link to="/home/profile">Profile</Link></li><li><Link to="/home/requests">Requests</Link></li></ul></div>
        </> : <Link to="/auth/login" className="bg-[#a8b324] text-[#0a472e] px-5 py-2 rounded-full">Login</Link>}
      </div>
    </div>
  </div>;
};
export default Navbar;
