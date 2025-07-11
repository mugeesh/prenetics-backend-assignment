const axios = require('axios');

async function getOrganizationId(orgname) {
    try {
        const response = await axios.get('http://localhost:8080/test/v1.0/org');
        console.log('API Response:', response.data);
        const orgs = response.data && response.data.data;
        if (Array.isArray(orgs)) {
            const foundOrg = orgs.find(
                org => org.attributes && org.attributes.name === orgname
            );
            if (foundOrg && foundOrg.id) {
                return foundOrg.id;
            } else {
                console.error('No organization with name "Prenetics" found.');
                return '';
            }
        }

        console.error('Malformed response:', response.data);
        return '';
    } catch (error) {
        console.error('Error fetching organization ID:', error);
        return '';
    }
}

async function sendProfile(profileName, organizationId) {
    const url = `http://localhost:8080/test/v1.0/org/${organizationId}/profile`;

    const data = {
        data: {
            type: 'profile',
            attributes: {
                name: profileName
            }
        }
    };

    try {
        const response = await axios.post(url, data, {
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        // Return the profileId from API response
        const profileId = response.data && response.data.data && response.data.data.id;
        console.log('Profile created, ID:', profileId);
        return profileId;
    } catch (error) {
        console.error('Error sending profile:', error);
        return null;
    }
}

async function AddSample(sampleId, result, organizationId, profileId) {
    const url = `http://localhost:8080/test/v1.0/org/${organizationId}/profile/${profileId}/sample`;

    const data = {
        data: {
            type: 'sample',
            attributes: {
                sampleId: sampleId,
                resultType: result
            }
        }
    };

    try {
        const response = await axios.post(url, data, {
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        console.log('Sample added:', response.data);
    } catch (error) {
        console.error('Error sending sample:', error);
    }
}

async function readNames() {
    const organizationId = await getOrganizationId('Circle');

    if (!organizationId) {
        console.error('No organization ID found. Exiting.');
        return; // Exit if no organization ID is found
    }

    let index =0
    for (const profile of profileDummyData) {
        console.log('Adding profile:', profile.name);
        const profileId = await sendProfile(profile.name, organizationId);

        if (!profileId) {
            console.error('Failed to create profile for', profile.name);
            continue; // Skip adding samples if profile creation failed
        }

        // if(index === 0){
            for (const sample of sampleDummyData) {
                console.log('Adding sample:', sample.sampleId, 'for profile:', profileId);
                await AddSample(sample.sampleId, sample.result, organizationId, profileId);
            }
            // index = index + 1;
        // }

    }
}

const profileDummyData = [
    { name: 'Peter Chan' },
    { name: 'Michael Caine' },
    { name: 'Bruce Lee' },
    { name: 'John Locke' },
    { name: 'Andrea Lau' }
];

const sampleDummyData = [
    {
        sampleId: '1234567890',
        result: 'negative'
    },
    {
        sampleId: '0987654321',
        result: 'negative'
    },
    {
        sampleId: '109876543211',
        result: 'negative'
    },
    {
        sampleId: '121212121212',
        result: 'negative'
    },
    {
        sampleId: '181818188181',
        result: 'negative'
    },
    {
        sampleId: '181818188182',
        result: 'positive'
    }

];

// Start the process
readNames();
