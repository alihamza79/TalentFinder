'use client'

import React, { useState } from 'react';

const faqData = [
  {
    id: 'collapseOne',
    question: "What does DIGI-X-TECH offer you?",
    answer: [
      "DIGI-X-TECH offers you the opportunity to take advantage of career opportunities in Germany and provides comprehensive support from creating your profile to finding accommodation."
    ]
  },
  {
    id: 'collapseTwo',
    question: "What is the DIGI-X-TECH Portal?",
    answer: [
      "DIGI-X-TECH portalı, iş ilanlarına ve şirketlere erişmenizi sağlar ve başvurmanıza veya şirketler tarafından bulunmanıza olanak tanır. Profil hizmetimiz ile profilinizi optimize ediyor ve profesyonel bir tanıtım videonuzu oluşturuyoruz."
    ]
  },
  {
    id: 'collapseThree',
    question: "What conditions must be met in order to come to Germany as a qualified employee?",
    answer: [
      `Gereklilikler arzu edilen hedefe bağlı olarak değişir. Genel olarak, işe başlamak için gerekli dil becerileri ile birlikte bir "Mavi Kart", bir "Denklik Sertifikası" veya bir ‚Denklik Ortaklığı‘ mevcut olmalıdır. Kişisel değerlendirmeniz için lütfen Talent-Scout’larımız ile iletişime geçin.`
    ]
  },
  {
    id: 'collapseFour',
    question: "Do I have to have knowledge of the German language?",
    answer: [
      "Dil becerileri, istihdam türüne ve sektöre bağlı olarak değişir. Yasal olarak gerekli dil seviyesi ne olursa olsun, en az B1 seviyesini tavsiye ediyoruz."
    ]
  },
  {
    id: 'collapseFive',
    question: "How long does the immigration procedure take and when should I apply?",
    answer: [
`The duration of the labor migration procedure depends on the type of visa applied for. In general, the procedure takes from a few weeks to a few months. Within the scope of the "accelerated skilled labor procedure", there are deadlines that the Consulate General must also comply with. It is recommended to apply as early as possible.`
    ]
  },
  {
    id: 'collapseSix',
    question: "What documents are required when registering on the DIGI-X-TECH portal?",
    answer: [
"To create a profile on the portal, an up-to-date CV, documents on professional training, additional qualifications and language skills are required."
    ]
  },
  {
    id: 'collapseSeven',
    question: "What documents are required for a visa?",
    answer: [
"The documents that need to be submitted depend on the type of visa and vary for educational and employment relationships. However, in principle, approval from the Federal Employment Agency, an educational or employment contract, proof of language skills and a valid passport are required in all cases."
    ]
  },
  {
    id: 'collapseEight',
    question: "How are health insurance and other social security conditions regulated for employees in Germany?",
    answer: [
"The documents that need to be submitted depend on the type of visa and vary for educational and employment relationships. However, in principle, approval from the Federal Employment Agency, an educational or employment contract, proof of language skills and a valid passport are required in all cases."
    ]
  }
];

const FaqChild = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleAccordion = (index) => {
    setActiveIndex(index === activeIndex ? -1 : index);
  };

  return (
    <div className="accordion" id="accordionExample">
      {faqData.map((faq, index) => (
        <div key={index} className="accordion-item accordion block active-block">
          <h2 className="accordion-header">
            <button
              className={`acc-btn accordion-button ${index === activeIndex ? '' : 'collapsed'}`}
              type="button"
              onClick={() => toggleAccordion(index)}
              aria-expanded={index === activeIndex ? 'true' : 'false'}
            >
              {faq.question}
            </button>
          </h2>
          <div
            id={faq.id}
            className={`${index === activeIndex ? 'max-h-screen opacity-100 transition-all duration-500 ease-in-out' : 'max-h-0 opacity-0 transition-all duration-500 ease-in-out overflow-hidden'}`}
            aria-labelledby={`heading${faq.id}`}
          >
            <div className="accordion-body">
              {faq.answer.map((paragraph, i) => (
                <div key={i} className="content">
                <p >{paragraph}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FaqChild;
