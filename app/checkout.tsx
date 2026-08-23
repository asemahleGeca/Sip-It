import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';

// TODO: replace with your real banking details
const BANK_DETAILS = {
  accountName: 'Sip It (Pty) Ltd',
  bank: 'Your Bank Name',
  accountNumber: '0000000000',
  branchCode: '000000',
};

export default function CheckoutScreen() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [reference, setReference] = useState('');
  const [proofUri, setProofUri] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Please allow photo access to attach proof of payment.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled && result.assets?.[0]) {
      setProofUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!fullName || !phone || !address || !reference) {
      Alert.alert('Missing info', 'Please fill in your name, phone, address, and payment reference.');
      return;
    }
    if (items.length === 0) {
      Alert.alert('Cart is empty', 'Add something to your cart before checking out.');
      return;
    }

    setSubmitting(true);
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        Alert.alert('Please sign in', 'You need to be signed in to place an order.');
        setSubmitting(false);
        return;
      }
      const userId = userData.user.id;

      let proofUrl: string | null = null;

      if (proofUri) {
        const fileExt = proofUri.split('.').pop() || 'jpg';
        const fileName = `${userId}-${Date.now()}.${fileExt}`;
        const response = await fetch(proofUri);
        const blob = await response.blob();

        const { error: uploadError } = await supabase.storage
          .from('payment-proofs')
          .upload(fileName, blob, { contentType: `image/${fileExt}` });

        if (uploadError) {
          Alert.alert('Upload failed', uploadError.message);
          setSubmitting(false);
          return;
        }

        const { data: publicUrlData } = supabase.storage
          .from('payment-proofs')
          .getPublicUrl(fileName);
        proofUrl = publicUrlData.publicUrl;
      }

      const orderItems = items.map((i) => ({
        id: i.product.id,
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
      }));

      const { error: insertError } = await supabase.from('orders').insert({
        user_id: userId,
        items: orderItems,
        total: totalPrice,
        full_name: fullName,
        phone,
        address,
        delivery_notes: notes || null,
        payment_reference: reference,
        payment_proof_url: proofUrl,
        status: 'pending_verification',
      });

      if (insertError) {
        Alert.alert('Order failed', insertError.message);
        setSubmitting(false);
        return;
      }

      clearCart();
      setSubmitted(true);
    } catch (err: any) {
      Alert.alert('Unexpected error', err.message || 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <View style={styles.container}>
        <View style={styles.successWrap}>
          <Text style={styles.successEmoji}>✅</Text>
          <Text style={styles.successTitle}>Order submitted!</Text>
          <Text style={styles.successText}>
            We're verifying your payment. Once confirmed, your order will be on its way.
          </Text>
          <TouchableOpacity style={styles.successButton} onPress={() => router.replace('/menu')}>
            <Text style={styles.successButtonText}>Back to Menu</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>

      <Text style={styles.eyebrow}>ALMOST THERE</Text>
      <Text style={styles.title}>Checkout</Text>

      <Text style={styles.sectionLabel}>Delivery details</Text>
      <TextInput
        style={styles.input}
        placeholder="Full name"
        placeholderTextColor="rgba(255,255,255,0.4)"
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone number"
        placeholderTextColor="rgba(255,255,255,0.4)"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />
      <TextInput
        style={[styles.input, styles.multiline]}
        placeholder="Delivery address (street, unit, city)"
        placeholderTextColor="rgba(255,255,255,0.4)"
        multiline
        value={address}
        onChangeText={setAddress}
      />
      <TextInput
        style={[styles.input, styles.multiline]}
        placeholder="Delivery notes (gate code, landmark, etc.) — optional"
        placeholderTextColor="rgba(255,255,255,0.4)"
        multiline
        value={notes}
        onChangeText={setNotes}
      />

      <Text style={styles.sectionLabel}>Order summary</Text>
      <View style={styles.summaryCard}>
        {items.map((i) => (
          <View key={i.product.id} style={styles.summaryRow}>
            <Text style={styles.summaryItem}>
              {i.quantity}x {i.product.name}
            </Text>
            <Text style={styles.summaryPrice}>R{i.quantity * i.product.price}</Text>
          </View>
        ))}
        <View style={styles.summaryDivider} />
        <View style={styles.summaryRow}>
          <Text style={styles.summaryTotalLabel}>Total</Text>
          <Text style={styles.summaryTotalValue}>R{totalPrice}</Text>
        </View>
      </View>

      <Text style={styles.sectionLabel}>Payment</Text>
      <View style={styles.bankCard}>
        <Text style={styles.bankNote}>
          Please make an EFT to the account below, then enter your payment reference.
          We'll verify it before confirming your order.
        </Text>
        <View style={styles.bankRow}>
          <Text style={styles.bankLabel}>Account name</Text>
          <Text style={styles.bankValue}>{BANK_DETAILS.accountName}</Text>
        </View>
        <View style={styles.bankRow}>
          <Text style={styles.bankLabel}>Bank</Text>
          <Text style={styles.bankValue}>{BANK_DETAILS.bank}</Text>
        </View>
        <View style={styles.bankRow}>
          <Text style={styles.bankLabel}>Account number</Text>
          <Text style={styles.bankValue}>{BANK_DETAILS.accountNumber}</Text>
        </View>
        <View style={styles.bankRow}>
          <Text style={styles.bankLabel}>Branch code</Text>
          <Text style={styles.bankValue}>{BANK_DETAILS.branchCode}</Text>
        </View>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Payment reference"
        placeholderTextColor="rgba(255,255,255,0.4)"
        value={reference}
        onChangeText={setReference}
      />

      <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
        <Text style={styles.photoButtonText}>
          {proofUri ? '📎 Change photo' : '📎 Attach proof of payment (optional)'}
        </Text>
      </TouchableOpacity>

      {proofUri && (
        <Image source={{ uri: proofUri }} style={styles.previewImage} resizeMode="cover" />
      )}

      <TouchableOpacity
        style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Submit Order</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const ACCENT = '#FF7A5C';
const BG = '#14121A';
const CARD = 'rgba(255,255,255,0.06)';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 60,
    paddingBottom: 60,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  eyebrow: {
    color: ACCENT,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 24,
  },
  sectionLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 10,
    marginTop: 8,
  },
  input: {
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#fff',
    fontSize: 15,
    marginBottom: 12,
  },
  multiline: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  summaryCard: {
    backgroundColor: CARD,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    padding: 16,
    marginBottom: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryItem: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
  },
  summaryPrice: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: 8,
  },
  summaryTotalLabel: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  summaryTotalValue: {
    color: ACCENT,
    fontWeight: '800',
    fontSize: 15,
  },
  bankCard: {
    backgroundColor: CARD,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    padding: 16,
    marginBottom: 12,
  },
  bankNote: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    marginBottom: 12,
    lineHeight: 18,
  },
  bankRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  bankLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
  },
  bankValue: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  photoButton: {
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  photoButtonText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
    fontWeight: '600',
  },
  previewImage: {
    width: '100%',
    height: 160,
    borderRadius: 14,
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: ACCENT,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: ACCENT,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  successWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  successEmoji: {
    fontSize: 50,
    marginBottom: 16,
  },
  successTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 10,
  },
  successText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  successButton: {
    backgroundColor: ACCENT,
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 16,
  },
  successButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
});