import { useState, useEffect } from 'react';
import {
  client, recommendProfiles
} from '../api'
import Link from 'next/link';

export default function Home() {
  const [profiles, setProfiles] = useState([]); // 새로 추가

  useEffect(()=>{
    fetchProfiles()
  },[])

  async function fetchProfiles() {
    try {
      const response = await client.query(recommendProfiles).toPromise();
      console.log({response})
      setProfiles(response.data.recommendedProfiles) // 새로 추가
    }catch(error){
      console.log({error});
    }
  }


  return (
    <div>
    {
      profiles.map((profile,index) => (
        <Link href={`/profile/${profile.id}`}>
          <a>
            <div style={{marginBottom: "100px"}}>
              {
                profile.coverPicture ? (
                  <img 
                    src={profile.coverPicture.original.url}
                    style={{width:"250px", height:"250px"}}
                  />
                ) : (
                  <img
                    src="https://icon-library.com/images/no-image-icon/no-image-icon-1.jpg"
                    style={{width:"250px", height: "250px"}}
                  />
                )
              }
              <h4>{profile.handle}</h4>
              <p>{profile.bio}</p>
              <hr/>
            </div>
          </a>
        </Link>
      ))
    }
    </div>
  );
}