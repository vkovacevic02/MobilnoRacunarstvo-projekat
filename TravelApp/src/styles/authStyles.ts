import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from '../constants/colors';
import { Sizes } from '../constants/sizes';

const { height } = Dimensions.get('window');

export const authStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  imageContainer: { flex: 1, position: 'relative' },
  backgroundImage: { width: '100%', height: '100%' },
  backButton: { position: 'absolute', top: 50, left: 20, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255, 255, 255, 0.9)', alignItems: 'center', justifyContent: 'center' },
  contentOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(255, 255, 255, 0.85)', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingHorizontal: Sizes.lg, paddingTop: Sizes.xl, paddingBottom: Sizes.xxl, minHeight: height * 0.6 },

  logoContainer: { alignItems: 'center', marginBottom: Sizes.xl },
  logoCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#EBF5FF', alignItems: 'center', justifyContent: 'center', marginBottom: Sizes.md },
  logoIcon: { fontSize: 40 },
  brandName: { fontSize: Sizes.fontSize.xxxl, fontWeight: 'bold', marginBottom: Sizes.xs },
  brandNameGo: { color: Colors.accent },
  brandNameTravel: { color: Colors.text },
  brandSubtitle: { fontSize: Sizes.fontSize.sm, color: Colors.textSecondary, letterSpacing: 2, textTransform: 'uppercase' },

  formContainer: { flex: 1 },
  inputContainer: { marginBottom: Sizes.lg, position: 'relative' },
  inputIcon: { position: 'absolute', left: 8, top: 12, fontSize: Sizes.fontSize.lg, zIndex: 1 },
  textInput: { fontSize: Sizes.fontSize.md, color: '#000000', paddingLeft: 30, paddingVertical: Sizes.sm, borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.3)', backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: 8, marginTop: 5 },
  textInputError: { borderBottomColor: '#ff6b6b', backgroundColor: 'rgba(255, 107, 107, 0.1)' },
  label: { fontSize: Sizes.fontSize.sm, color: Colors.text, fontWeight: '600', marginBottom: 5 },
  eyeButton: { position: 'absolute', right: 8, top: 8, padding: Sizes.sm },
  eyeIcon: { fontSize: Sizes.fontSize.lg },
  inputLine: { height: 1, backgroundColor: 'rgba(255, 255, 255, 0.3)', marginTop: Sizes.xs },

  forgotPasswordContainer: { alignItems: 'flex-end', marginBottom: Sizes.xl },
  forgotPasswordText: { color: Colors.textSecondary, fontSize: Sizes.fontSize.sm },

  loginButton: { backgroundColor: Colors.primary, paddingVertical: Sizes.lg, borderRadius: Sizes.radius.lg, alignItems: 'center', marginBottom: Sizes.lg, shadowColor: Colors.shadow.dark, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 8 },
  loginButtonDisabled: { opacity: 0.6 },
  loginButtonText: { color: 'white', fontSize: Sizes.fontSize.lg, fontWeight: 'bold' },

  orContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: Sizes.lg },
  orLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  orText: { color: Colors.textSecondary, fontSize: Sizes.fontSize.sm, marginHorizontal: Sizes.md },


  signInButton: { backgroundColor: 'rgba(255, 255, 255, 0.9)', borderWidth: 2, borderColor: Colors.primary, paddingVertical: Sizes.lg, borderRadius: Sizes.radius.lg, alignItems: 'center', shadowColor: Colors.shadow.dark, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 4 },
  signInButtonText: { color: Colors.primary, fontSize: Sizes.fontSize.lg, fontWeight: 'bold' },

  errorContainer: { marginTop: 10, marginBottom: 10 },
  errorText: { color: '#ff6b6b', fontSize: 14, textAlign: 'center', fontWeight: '500' },
  
  subtitle: { fontSize: Sizes.fontSize.md, color: Colors.textSecondary, textAlign: 'center', marginBottom: Sizes.xl, lineHeight: 22 },
  
  // Sign in container
  signInContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: Sizes.lg },
  signInText: { fontSize: Sizes.fontSize.sm, color: Colors.textSecondary },
});


