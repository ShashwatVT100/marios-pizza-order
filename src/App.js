import { useState } from 'react';
import './App.css';

function App() {
  const [customerInfo,setCustomerInfo]=useState({
    name:'',
    phone:'',
    email:'',
    address:'',
    isDelivery:true
  });
  const [pizzaOrder,setPizzaOrder]=useState({
    size:'medium',
    crust:'regular',
    toppings:[],
    specialInstructions:''
  });
  const [formState,setFormState]=useState({
    errors:{},
    isSubmitting:false,
    showOrderSummary:false,
    currentErrors:{}
  });
  const calculateTotalPrice=()=>{
    let total=0;
    const sizePrices={
      small:12.99,
      medium:15.99,
      large:18.99,
      xlarge:21.99
    };
    total+=sizePrices[pizzaOrder.size];
    const crustPrizes={
      regular:0,
      thin:1.00,
      thick:2.00,
      stuffed:3.00
    };
    total+=crustPrizes[pizzaOrder.crust];
    total+=pizzaOrder.toppings.length*1.50;
    if(customerInfo.isDelivery){
      total+=2.99;
    }
    return total.toFixed(2);
  };
  const calculateTotalItemPrice=()=>{
    let total=0;
    const sizePrices={
      small:12.99,
      medium:15.99,
      large:18.99,
      xlarge:21.99
    };
    total+=sizePrices[pizzaOrder.size];
    const crustPrizes={
      regular:0,
      thin:1.00,
      thick:2.00,
      stuffed:3.00
    };
    total+=crustPrizes[pizzaOrder.crust];
    return total.toFixed(2);
  };
  const validateForm=()=>{
    const errors={};
    if(!customerInfo.name.trim()||customerInfo.name.trim().length<2){
      errors.name='Please enter your full name';
    }
    const phoneRegex=/^[\d\s\-\(\)\+]{10,}$/;
    if(!customerInfo.phone.trim()){
      errors.phone='Phone number is required';
    }else if(!phoneRegex.test(customerInfo.phone.replace(/\s/g,''))){
      errors.phone='Please enter a valid phone number';
    }
    const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!customerInfo.email.trim()){
      errors.email='Email address is required';
    }else if(!emailRegex.test(customerInfo.email)){
      errors.email='Please enter a valid email address';
    }
    if(customerInfo.isDelivery&&!customerInfo.address.trim()){
      errors.address='Delivery address is required';
    }
    if(pizzaOrder.toppings.length===0){
      errors.toppings='Please select at least one topping';
    }
    return errors;
  };
  const checkValidation=()=>{
    const errors=validateForm();
    setFormState(prev=>({
      ...prev,
      currentErrors:errors
    }));
    return Object.keys(errors).length===0;
  };
  const handleSubmit=async(e)=>{
    e.preventDefault();
    const isValid=checkValidation();
    if(!isValid){
      const firstError=document.querySelector('.error');
      if(firstError){
        firstError.scrollIntoView({behavior:'smooth',block:'center'});
      }
      return;
    }
    setFormState(prev=>({
      ...prev,
      isSubmitting:true
    }));
    try{
      const orderData={
        customer:customerInfo,
        pizza:pizzaOrder,
        total:calculateTotalItemPrice(),
        orderTime: new Date().toISOString(),
        estimatedDelivery:customerInfo.isDelivery?'45-60 minutes':'20-30 minutes'
      };
      console.log('Submitting order: ',orderData);
      alert(`Order placed successfully!
        
      Order ID: ${Math.floor(Math.random()*100000)}
      Total: $${calculateTotalPrice()}
      ${customerInfo.isDelivery?`Delivery to: ${customerInfo.address}`:`Ready for pickup at Mario's Pizza`}
      Thank you, ${customerInfo.name}`);
        setCustomerInfo({
          name:'',
          phone:'',
          email:'',
          address:'',
          isDelivery:true
        });
        setPizzaOrder({
          size:'medium',
          crust:'regular',
          toppings:[],
          specialInstructions:''
        });
    }catch(error){
      console.log('Order submission failed: ',error);
      alert('Sorry, there was a problem placing your order. Please try again or call Mario\'s Pizza');
    }finally{
      setFormState(prev=>({
        ...prev,
        isSubmitting:false
      }));
    }
  };
  return (
    <div className="App">
      <header>
        <h1>Mario's Pizza - Online Ordering</h1>
        <p>Authentic Brooklyn Pizza Since 1952</p>
      </header>
      <main>
        <form className='pizza-order-form' onSubmit={handleSubmit}>
          <h2>Place your order</h2>
          <section className='customer-info'>
            <h3>Customer Information</h3>
            <div className='form-group'>
              <label htmlFor='customer-name'>Full name</label>
              <input type='text' id='customer-name' name='name' value={customerInfo.name} onChange={(e)=>{setCustomerInfo({...customerInfo,name:e.target.value});if(formState.currentErrors.name){setFormState(prev=>({...prev,currentErrors:{...prev.currentErrors,name:''}}))}}} onBlur={checkValidation} className={formState.currentErrors.name?'error':''} placeholder='Enter your full name' required/>
              {formState.currentErrors.name&&(<span className='error-message'>{formState.currentErrors.name}</span>)}
            </div>
            <div className='form-group'>
              <label htmlFor='customer-phone'>Phone Number</label>
              <input type='tel' id='customer-phone' name='phone' value={customerInfo.phone} onChange={(e)=>{setCustomerInfo({...customerInfo,phone:e.target.value});if(formState.currentErrors.phone){setFormState(prev=>({...prev,currentErrors:{...prev.currentErrors,phone:''}}))}}} placeholder='(555) 123-4567' required/>
              {formState.currentErrors.phone&&(<span className='error-message'>{formState.currentErrors.phone}</span>)}
            </div>
            <div className='form-group'>
              <label htmlFor='customer-email'>Email Address</label>
              <input type='email' id='customer-email' name='email' value={customerInfo.email} onChange={(e)=>{setCustomerInfo({...customerInfo,email:e.target.value});if(formState.currentErrors.email){setFormState(prev=>({...prev,currentErrors:{...prev.currentErrors,email:''}}))}}} placeholder='your.email@gmail.com' required/>
              {formState.currentErrors.email&&(<span className='error-message'>{formState.currentErrors.email}</span>)}
            </div>
            <div className='form-group'>
              <label htmlFor='customer-address'>Delivery Address</label>
              <textarea id='customer-address' name='address' value={customerInfo.address} onChange={(e)=>{setCustomerInfo({...customerInfo,address:e.target.value});if(formState.currentErrors.address){setFormState(prev=>({...prev,currentErrors:{...prev.currentErrors,address:''}}))}}} placeholder='123 Main street, Brooklyn, NY 10001' rows={3}/>
            </div>
            <div className='form-group'>
              <fieldset>
                <legend>Order Type</legend>
                <div className='radio-group'>
                  <label>
                    <input type='radio' name='orderType' value='delivery' checked={customerInfo.isDelivery===true} onChange={()=>setCustomerInfo({...customerInfo,isDelivery:true})}/>
                    Delivery (45-60 minutes)
                  </label>
                  <label>
                    <input type='radio' name='orderType' value='pickup' checked={customerInfo.isDelivery===false} onChange={()=>setCustomerInfo({...customerInfo,isDelivery:false})}/>
                    Pickup (20-30 minutes)
                  </label>
                </div>
              </fieldset>
            </div>
          </section>
          <section className='pizza-customization'>
            <h3>Build your Pizza</h3>
            <div className='form-group'>
              <label htmlFor='pizza-size'>Pizza Size</label>
              <select id='pizza-size' name='size' value={pizzaOrder.size} onChange={(e)=>setPizzaOrder({...pizzaOrder,size:e.target.value})}>
                <option value='small'>Small 10"-$12.99</option>
                <option value='medium'>Medium 12"-$15.99</option>
                <option value='large'>Large 14"-$18.99</option>
                <option value='xlarge'>X-Large 16"-$21.99</option>
              </select>
            </div>
            <div className='form-group'>
              <label htmlFor='pizza-crust'>Pizza Size</label>
              <select id='pizza-cruse' name='crust' value={pizzaOrder.crust} onChange={(e)=>setPizzaOrder({...pizzaOrder,crust:e.target.value})}>
                <option value='regular'>Regular Crust</option>
                <option value='thin'>Thin Crust(+$1.00)</option>
                <option value='thick'>Thick Crust(+$2.00)</option>
                <option value='stuffed'>Stuffed Crust(+$3.00)</option>
              </select>
            </div>
            <div className='form-group'>
              <fieldset>
                <legend>Your Toppings (Each +$1.50)</legend>
                <div className='toppings-grid'>
                  {
                    [
                      'pepperoni','sausage','mushrooms','green pepper','onions','olives','jalapenos'
                    ].map(topping=>(
                      <label key={topping} className='topping-option'>
                        <input type='checkbox' name='topping' value={topping} checked={pizzaOrder.toppings.includes(topping)} onChange={(e)=>{
                          if(e.target.checked){
                            setPizzaOrder({
                              ...pizzaOrder,
                              toppings:[...pizzaOrder.toppings,topping]
                            })
                          }else{
                            setPizzaOrder({
                              ...pizzaOrder,
                              toppings:pizzaOrder.toppings.filter(t=>t!==topping)
                            })
                          }
                        }}/>
                        {topping.charAt(0).toUpperCase()+topping.slice(1)}
                      </label>
                    ))
                  }
                </div>
                {formState.currentErrors.toppings&&(<span className='error-message'>{formState.currentErrors.toppings}</span>)}
                <div className='form-group'>
                  <label htmlFor='special-instructions'>Special Instructions (Optional)</label>
                  <textarea id='special-instructions' name='specialInstructions' value={pizzaOrder.specialInstructions} onChange={(e)=>setPizzaOrder({...pizzaOrder,specialInstructions:e.target.value})} placeholder='Any special request' rows='3' maxLength='200'/>
                  <small className='character-count'>{pizzaOrder.specialInstructions.length}/200 characters</small>
                </div>
              </fieldset>
            </div>
          </section>
          <section className='order-summary'>
            <h3>Order Summary</h3>
            <div className='summary-item'>
              <span className='item-name'>
                {pizzaOrder.size.charAt(0).toUpperCase()+pizzaOrder.size.slice(1)} Pizza with {pizzaOrder.crust.charAt(0).toUpperCase()+pizzaOrder.crust.slice(1)} Crust
              </span>
              <span className='item-price'>
                ${calculateTotalItemPrice()}
              </span>
              {pizzaOrder.toppings.length>0&&(
                <div className='summary-item'>
                  <span className='item-name'>
                    Toppings: {pizzaOrder.toppings.join(', ')}
                  </span>
                  <span className='item-price'>
                    ${(pizzaOrder.toppings.length*1.5).toFixed(2)}
                  </span>
                </div>
              )}
              {
                customerInfo.isDelivery&&(
                  <div className='summary-item'>
                    <span className='item-name'>Delivery Fee</span>
                    <span className='item-price'>$2.99</span>
                  </div>
                )
              }
              <div className='summary-total'>
                <span className='total-label'>Total:</span>
                <span className='total-price'>${calculateTotalPrice()}</span>
              </div>
              {customerInfo.name&&(
                <div className='customer-detail'>
                  <p><strong>Customer:</strong>{customerInfo.name}</p>
                  {customerInfo.phone&&<p><strong>Phone:</strong>{customerInfo.phone}</p>}
                  {customerInfo.isDelivery?(
                    <p><strong>Delivery to:</strong>{customerInfo.address||'Address Needed'}</p>
                  ):(
                    <p><strong>Pickup</strong> at Mario's Pizza (Est. 20-30 minutes)</p>
                  )}
                </div>
              )}
            </div>
          </section>
          <button type='submit' className='submit-btn' disabled={formState.isSubmitting}>{formState.isSubmitting?(<span className='loading-spinner'>Processing Order</span>):(`Place Order - ${calculateTotalPrice()}`)}</button>
        </form>
      </main>
    </div>
  );
}

export default App;
