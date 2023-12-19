const MODAL_BG = 'modal_bg';
const ACTIVE = 'active';
const OVERFLOW = 'overflow';
const INPUT = 'INPUT';
const bodyElem = document.querySelector('body');
const modalBackgroundElem = document.querySelector('.modal_bg');
const modalCloseBtn = document.querySelector('.modal_close');
const checkboxElem = document.querySelector('.duty_wrapper .check_list');

let checkboxData = { id: null };

const handleCloseModal = function(event) {
   const { target } = event; 
   const targetModalBackground = target.classList.toggle(MODAL_BG);

   if(targetModalBackground) return;

   this.classList.remove(ACTIVE);
   bodyElem.classList.remove(OVERFLOW);

   event.stopPropagation();
};


const targetCheckbox = function(event) {
   const { target } = event;
   const { tagName } = target;

   if(tagName !== INPUT) return;

   const id = target.getAttribute('value');
   const checked = target.checked;

   checkboxData = { id };
   bodyElem.classList.add(OVERFLOW);
   modalBackgroundElem.classList.add(ACTIVE);

   event.preventDefault();
};

const handletoggleCheckBox = ({ data }) => {
   const { id, checked } = data;
   const targetInputElem = document.getElementById(`work_${id}`);

   targetInputElem.checked = checked;

   modalBackgroundElem.classList.remove(ACTIVE);
   bodyElem.classList.remove(OVERFLOW);
}; 

const everyWorksCheck = async function() {

   try {
      await fetch(`/api/checked/${checkboxData.id}`, {
         method: 'PUT',
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify(checkboxData),
      })
      .then( res => res.json())
      .then( res => {
         const { message, result } = res;

         if(result) {
            handletoggleCheckBox(res);
            alert(message);
         } else {
            alert('오류가 있습니다. 다시 시도해주세요.');
         };

      })
      .catch( err => {
         console.log(err, 'err')
      })

   } catch ( err ) {
      console.log(err)
   }

};

modalBackgroundElem.addEventListener('click', handleCloseModal);
modalCloseBtn.addEventListener('click', handleCloseModal);
checkboxElem.addEventListener('click', targetCheckbox);