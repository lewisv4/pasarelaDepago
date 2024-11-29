import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { initMercadoPago } from '@mercadopago/sdk-react';

// Inicializa Mercado Pago con la clave pública
initMercadoPago('APP_USR-c76d9671-4637-4f96-9f95-948a1ade11e9'); // Reemplaza con tu clave pública real

// Define tu token de acceso
const accessToken = 'TU_TOKEN_AQUI'; // Reemplaza con tu token de acceso real

export default function PricingPlans() {
  const [selectedPlan, setSelectedPlan] = useState(null); // Estado para controlar el plan seleccionado

  const plans = [
    {
      name: "Premium",
      price: 200000,
      description: "Duración 30 días.",
      features: [
        "Exposición en los listados alta",
        "Puedes republicar por un año sin costo adicional",
        "Costo para carros y otros $200.000",
        "Costo para motos $80.000",
      ],
      buttonText: "Comprar",
    },
    {
      name: "Plus",
      price: 99000,
      description: "Duración del plan 30 días.",
      features: [
        "Exposición en los listados alta",
        "Duración 30 días",
        "Costo para carros y otros $99.000",
        "Costo para motos $50.000",
      ],
      buttonText: "Comprar",
    },
    {
      name: "Limited",
      price: 70000,
      description: "Duración del plan 30 días.",
      features: [
        "Exposición en los listados Media",
        "Duración 30 días",
        "Costo para carros y otros $70.000",
        "Costo para motos $30.000",
      ],
      buttonText: "Comprar",
    },
  ];

  const handleSelectPlan = (index) => {
    setSelectedPlan(index); // Actualiza el plan seleccionado
  };

  const handleButtonPress = async (name, price, description) => {
    try {
      const response = await fetch('https://nuevocar.com/paymentsplans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`, // Usa el token de acceso
        },
        body: JSON.stringify({
          title: name,
          unit_price: price,
          quantity: 1,
          description,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error al crear preferencia: ${response.status}`);
      }

      const data = await response.json();

      if (data.preferenceId) {
        console.log('Preferencia creada:', data.preferenceId);
        window.location.href = `https://www.mercadopago.com.co/checkout/v1/redirect?preference-id=${data.preferenceId}`;
      } else {
        console.error('Error al obtener preferenceId:', data);
        alert('Hubo un problema al procesar el pago. Intenta nuevamente.');
      }
    } catch (error) {
      console.error('Error al procesar la solicitud:', error);
      alert('Ocurrió un error inesperado. Por favor, verifica tu conexión o intenta nuevamente.');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Escoge tu plan</h2>
      <small className="text-center d-block mb-4">
        Revisa todas las posibilidades que tenemos para ti. Precios vigentes desde el 02 de Enero del 2024.
      </small>
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`col mb-4 ${selectedPlan === index ? 'selected-plan' : ''}`}
            onClick={() => handleSelectPlan(index)} // Al hacer clic, selecciona el plan
          >
            <div
              className={`card h-100 shadow-sm ${selectedPlan === index ? 'border-primary bg-light border-3' : ''} transition-shadow`}
              style={{ cursor: 'pointer', transition: 'box-shadow 0.3s, transform 0.3s' }}
            >
              <div className={`card-header ${selectedPlan === index ? 'bg-primary text-white' : ''}`}>
                <h4 className="my-0 fw-normal">{plan.name}</h4>
              </div>
              <div className="card-body">
                <h1 className="card-title pricing-card-title">
                  ${plan.price.toLocaleString()}
                  <small className="text-muted">/mo</small>
                </h1>
                <p>{plan.description}</p>
                <ul className="list-unstyled">
                  {plan.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
                <button
                  className={`btn btn-lg ${selectedPlan === index ? 'btn-light text-primary' : 'btn-outline-primary'} w-100`}
                  onClick={() => handleButtonPress(plan.name, plan.price, plan.description)}
                >
                  {plan.buttonText}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
