import React from 'react'
import {Link} from 'react-router'

import "../style/panel.scss";
const RightPanel = () => {
  return (
   <div className='right-pannel pannel'>
       <div className='container'>
        <p>Suggested</p>
        <hr className='hr'/>
        <ul>
        
          <li>
            <div className="user">
          <img src="https://ik.imagekit.io/a2vhcigch/default-dp.png" alt="!image" className='userImage' />

          <div className="user-data">
            <h2>Karan Swarnakar <span className="verified">
              <img
                src="https://ik.imagekit.io/icuoatuu2/transparent.png"
                alt="Verified"

              />
            </span></h2>
            <p>@karan </p>
          </div>
         <button className='button btn-primary'>Folow</button>
        </div>
          </li>
          <li>
            <div className="user">
          <img src="https://ik.imagekit.io/a2vhcigch/default-dp.png" alt="!image" className='userImage' />

          <div className="user-data">
            <h2>Karan Swarnakar <span className="verified">
              <img
                src="https://ik.imagekit.io/icuoatuu2/transparent.png"
                alt="Verified"

              />
            </span></h2>
            <p>@karan </p>
          </div>
         <button className='button btn-primary'>Folow</button>
        </div>
          </li>
          <li>
            <div className="user">
          <img src="https://ik.imagekit.io/a2vhcigch/default-dp.png" alt="!image" className='userImage' />

          <div className="user-data">
            <h2>Karan Swarnakar <span className="verified">
              <img
                src="https://ik.imagekit.io/icuoatuu2/transparent.png"
                alt="Verified"

              />
            </span></h2>
            <p>@karan </p>
          </div>
         <button className='button btn-primary'>Folow</button>
        </div>
          </li>
          <li>
            <div className="user">
          <img src="https://ik.imagekit.io/a2vhcigch/default-dp.png" alt="!image" className='userImage' />

          <div className="user-data">
            <h2>Karan Swarnakar <span className="verified">
              <img
                src="https://ik.imagekit.io/icuoatuu2/transparent.png"
                alt="Verified"

              />
            </span></h2>
            <p>@karan </p>
          </div>
         <button className='button btn-primary'>Folow</button>
        </div>
          </li>
        </ul>
        <Link to={"/create-post"}>More</Link>
      </div>

      
    </div>
  )
}

export default RightPanel
