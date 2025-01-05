export function goTopBtn(target){
    // console.log("Running goTopBtn");
    const options = {
        rootMargin: "0px",
        threshold: 1.0,
      };
    
    const observer = new IntersectionObserver(callback, options);
      
      function callback(entries, observer){
        entries.forEach(entrie => {
            if(entrie.isIntersecting){
                document.getElementById("btn-top").style.bottom = "3rem";
            }
            else
                document.getElementById("btn-top").style.bottom = "-3rem";
        });
      }
      observer.observe(target);
}