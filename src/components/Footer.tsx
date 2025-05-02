const Footer = () => {
  return (
    <div className='bg-primary py-10'>
      <div className='container mx-auto flex flex-col md:flex-row justify-between items-center'>
        <span className='text-3xl text-primary-foreground font-bold tracking-tight'>
          CunnoSomali.com
        </span>
        <span className='text-primary-foreground font-bold tracking-tight flex gap-4'>
          <span className="hover:text-accent-foreground cursor-pointer">Privacy Policy</span>
          <span className="hover:text-accent-foreground cursor-pointer">Terms of Service</span>
        </span>
      </div>
    </div>
  )
}

export default Footer;