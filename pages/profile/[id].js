import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { client, getProfiles, getPublications } from '../../api'
import {ethers} from 'ethers';

import ABI from '../../abi.json';
const address = "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d";

export default function Profile() {
    const [profile, setProfile] = useState();
    const [pubs, setPubs] = useState([]);

    useEffect(() => {
        if (id) {
            fetchProfile()
        }
    }, [id])
    async function fetchProfile() {
        try {
            const response = await client.query(getProfiles, { id }).toPromise();
            console.log('response: ', response);
            setProfile(response.data.profiles.items[0])

            const publicationData = await client.query(getPublications, { id }).toPromise();
            console.log(publicationData);
            setPubs(publicationData.data.publications.items)
        } catch (error) {
            console.log(error);
        }
    }

    async function connect() {
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts"
        })
        console.log(accounts);
    }

    async function followUser() {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const contract = new ethers.Contract(
            address,
            ABI,
            signer
        )

        try {
            const tx = contract.follow(
                [id],[0x0]
            )
            await tx.wait();
            console.log("followed user successfully...");
        }catch(error){
            console.log(error); 
        }
    }

    const router = useRouter()
    const { id } = router.query;


    if (!profile) return null

    return (
        <div>
            
            {
                profile.coverPicture ? (
                    <img
                        src={profile.coverPicture.original.url}
                        style={{ width: "250px", height: "250px" }}
                    />
                ) : (
                    <img
                        src="https://icon-library.com/images/no-image-icon/no-image-icon-1.jpg"
                        style={{ width: "250px", height: "250px" }}
                    />
                )
            }
            <div>
            <button onClick={connect}>Connecct</button>
            <button onClick={followUser}>Follow User</button>
            </div>
            <div>
                <h4>{profile.handle}</h4>
                <p>{profile.bio}</p>
                <p>Followers: {profile.stats.totalFollowers}</p>
                <p>Following: {profile.stats.totalFollowing}</p>
            </div>
            <div>
                {
                    pubs.map((pub, index) => (
                        <div style={{ padding: '20px', borderTop: '1px solid gray' }}>
                            {pub.metadata.content}
                        </div>
                    ))
                }
            </div>
        </div>
    )
}