import hero from '../assets/hero (1).png'

const Hero = () => {
  return (
    <div className="border-b border-border">
      <img 
        src={hero} 
        alt="Somali cuisine showcase" 
        className='w-full max-h-[600px] object-cover'
      />
    </div>
  )
}
export default Hero;