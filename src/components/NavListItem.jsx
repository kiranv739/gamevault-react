function NavListItem({ item, navOnClick }) {
  return (
    <li>
      <button type="button" className={`btn btn-link p-0 text-decoration-none ${item.active ? 'active': ''}`} onClick={() => navOnClick(item._id,item.target)}>
        <i className={`bi ${item.icon}`}></i>
        <span className='navName'>{item.name}</span>
      </button>
    </li>
  );
}

export default NavListItem;