/*
 * This Java source file was generated by the Gradle 'init' task.
 */
package ca.mcgill.ecse211.project;

import static ca.mcgill.ecse211.project.Resources.leftTacho;
import static ca.mcgill.ecse211.project.Resources.rightTacho;
import static ca.mcgill.ecse211.project.Resources.leftMotor;
import static ca.mcgill.ecse211.project.Resources.rightMotor;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import java.io.OutputStream;
import java.io.PrintStream;
import java.lang.reflect.Field;
import java.util.Arrays;
import java.util.Timer;
import java.util.TimerTask;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

class AppTest {
  
  /**
   * The delay it takes to start the odometer thread in the remote build environment
   * and suppress irrelevant output, in milliseconds.
   */
  public static final int DELAY = 350;
  
  static Odometer odometer = Odometer.getOdometer();
  
  /**
   * Setup run once before all tests.
   */
  @BeforeAll static void setup() {
    setupOdometer();
  }
  
  // Test methods. They are run in arbitrary order, so they should not depend on one another.
  @Test void testJunitIsCorrectlyLoaded() {
    assertEquals(true, true);
  }

  /*@Test*/ void testOdometer() {
    resetOdometer();
    for (int i = 0; i < 10; i++) {
//      setPrivateField(Resources.class, "leftTacho", 1000 * i);
//      setPrivateField(Resources.class, "rightTacho", 1000 * i);
      System.out.println("lt: "+readPrivateField(new Resources(), "leftTacho"));
      
      // Do checks on odometer values here
      System.out.println(Arrays.toString(odometer.getXYT()));
      Main.sleepFor(100);
    }
  }
  
  @Test void floatMotors() {
    incrementingTachocountsBySameAmountShouldMakeOdoXOrYIncrease();
  }
  
  void incrementingTachocountsBySameAmountShouldMakeOdoXOrYIncrease() {
    resetOdometer();
    for (int i = 0; i < 5; i++) {
      leftMotor_forward();
      rightMotor_forward();
      
      Main.sleepFor(500);
      System.out.println(Arrays.toString(odometer.getXYT()));
    }
    assertTrue(odometer.getXYT()[0] > 0 || odometer.getXYT()[1] > 0);
  }
  
  // Helper and utility methods
  static void leftMotor_forward() {
    try {
      leftMotor.forward();
    } catch (Exception e) {
      leftTacho++;
    }
  }
  
  static void rightMotor_forward() {
    try {
      rightMotor.forward();
    } catch (Exception e) {
      rightTacho++;
    }
  }
  
  /**
   * Starts the odometer thread. This should be only called once.
   */
  static void setupOdometer() {
    //disableResources();
    runWithoutOutput(() -> new Thread(odometer).start());
    Main.sleepFor(DELAY);
    System.out.println("Odometer ready");
  }
  
  /**
   * Resets the odometer state. x, y, theta, and the tachocounts are all reset to zero.
   */
  static void resetOdometer() {
    setPrivateField(new Resources(), "leftTacho", 0);
    setPrivateField(new Resources(), "rightTacho", 0);
    setPrivateField(odometer, "leftMotorTachoCount", 0);
    setPrivateField(odometer, "rightMotorTachoCount", 0);
    odometer.setXYT(0, 0, 0);
  }
  
  /**
   * Runs runnable without irrelevant outputs, to make test output clearer.
   */
  public static void runWithoutOutput(Runnable runnable) {
    var stdout = System.out;
    var stderr = System.err;
    var noOutput = new PrintStream(new OutputStream() {
      public void write(int b) {}
    });
    
    System.setOut(noOutput);
    System.setErr(noOutput);
    
    runnable.run();
    
    new Timer().schedule(new TimerTask() {
      public void run() {
        System.setOut(stdout);
        System.setErr(stderr);
      }
    }, DELAY);
    
  }
  
  /**
   * 
   * @param object
   * @param fieldName
   */
  public static Object readPrivateField(Object object, String fieldName) {
    try {
      Field field = object.getClass().getDeclaredField(fieldName);
      field.setAccessible(true);
      return field.get(object);
    } catch (NoSuchFieldException | SecurityException | IllegalArgumentException |
        IllegalAccessException e) {
      e.printStackTrace();
    }
    return null; // should not happen
  }
  
  /**
   * 
   * @param clazz
   * @param fieldName
   * @param value
   */
  public static void setPrivateField(Class<?> clazz, String fieldName, Object value) {
    try {
      Field field = clazz.getDeclaredField(fieldName);
      field.setAccessible(true);
      field.set(clazz, value.getClass().cast(value));
    } catch (NoSuchFieldException | SecurityException | IllegalArgumentException |
        IllegalAccessException e) {
      e.printStackTrace();
    }
  }
  
  /**
   * 
   * @param object
   * @param fieldName
   * @param value
   */
  public static void setPrivateField(Object object, String fieldName, Object value) {
    try {
      Field field = object.getClass().getDeclaredField(fieldName);
      field.setAccessible(true);
      field.set(object, value.getClass().cast(value));
    } catch (NoSuchFieldException | SecurityException | IllegalArgumentException |
        IllegalAccessException e) {
      e.printStackTrace();
    }
  }
  
}