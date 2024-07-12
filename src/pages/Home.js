import React, { Component } from 'react';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dogs: [],
      searchTerm: '',
      error: null
    };
  }

  async componentDidMount() {
    try {
      const res =  await fetch("https://api.thedogapi.com/v1/breeds");
      const data = await res.json();
      this.setState({ dogs: data });
      this.fetchDogImages(data);
    } catch (error) {
      this.setState({ error: 'Failed to fetch data from the API' });
      console.error(error);
    }
  }

  fetchDogImages = async (dogs) => {
    try {
      const updatedDogs = await Promise.all(dogs.map(async (dog) => {
        const breedName = dog.name.toLowerCase().split(' ').join('/');
        try {
          const res = await fetch(`https://dog.ceo/api/breed/${breedName}/images/random`);
          const data = await res.json();
          if (data.status === 'success') {
            return { ...dog, imageUrl: data.message };
          }
        } catch (error) {
          console.error(`Failed to fetch image for ${dog.name}`, error);
        }
        return dog;
      }));
      this.setState({ dogs: updatedDogs });
    } catch (error) {
      console.error('Failed to fetch images from the Dog CEO API', error);
    }
  };

  handleSearchChange = (event) => {
    this.setState({ searchTerm: event.target.value });
  };

  handleSearchSubmit = (event) => {
    event.preventDefault();
    
  };

  render() {
    const { dogs, searchTerm, error } = this.state;
    const filteredDogs = dogs.filter(dog => 
      dog.name.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 10); 

    return (
      <>
        {dogs.length === 0 && !error ? (
          <h1 className='flex items-center justify-center text-center px-5 text-3xl h-screen uppercase'>
            Loading...
          </h1>
        ) : error ? (
          <h1 className='flex items-center justify-center text-center px-5 text-3xl h-screen uppercase text-red-500'>
            {error}
          </h1>
        ) : (
          <section className='p-8 max-w-6xl mx-auto'>
            <div className='text-center'>
              <h1 className='flex items-center justify-center text-center px-5 text-3xl font-bold lg:text-5xl'>
                The Dog World
              </h1>
              <p className='my-8'>
                This Application is powered by{' '}
                <a href='https://thedogapi.com' className='text-indigo-600 underline active:text-orange-400'>
                  The Dog Api
                </a>
              </p>

              <form 
                className='max-w-xl mx-auto flex' 
                autoComplete='off'
                onSubmit={this.handleSearchSubmit}
              >
                <input
                  type='text'
                  name='search'
                  id='search'
                  placeholder='Search for a dog/breed'
                  value={searchTerm}
                  onChange={this.handleSearchChange}
                  className='py-2 px-4 rounded shadow w-full'
                />
                <button
                  type='submit'
                  className='ml-4 bg-indigo-600 text-white py-2 px-4 rounded shadow hover:bg-indigo-700 transition duration-300 ease-in-out'
                >
                  Search
                </button>
              </form>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8'>
              {filteredDogs.map((dog) => (
                <article key={dog.id} className='border rounded-lg p-4'>
                  {dog.imageUrl ? (
                    <img src={dog.imageUrl} alt={dog.name} className='w-full h-48 object-cover rounded-lg mb-4'/>
                  ) : (
                    <div className='w-full h-48 flex items-center justify-center bg-gray-200 rounded-lg mb-4'>
                      <span>No image available</span>
                    </div>
                  )}
                  <h3 className='text-xl font-bold'>{dog.name}</h3>
                  <p className='text-gray-600'>Bred For: {dog.bred_for}</p>
                  <p className='text-gray-600'>Breed Group: {dog.breed_group}</p>
                </article>
              ))}
            </div>
          </section>
        )}
      </>
    );
  }
}

export default Home;
