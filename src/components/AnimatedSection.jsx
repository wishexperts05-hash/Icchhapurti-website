// // components/AnimatedSection.jsx
// import { motion } from "framer-motion";

// const AnimatedSection = ({ children }) => {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 60 }}        // start lower + invisible
//       whileInView={{ opacity: 1, y: 0 }}     // move up and show when in view
//       viewport={{ once: false, amount: 0.3 }}// trigger when 30% visible [web:68][web:75]
//       transition={{ duration: 0.6, ease: "easeOut" }}
//     >
//       {children}
//     </motion.div>
//   );
// };

// export default AnimatedSection;
