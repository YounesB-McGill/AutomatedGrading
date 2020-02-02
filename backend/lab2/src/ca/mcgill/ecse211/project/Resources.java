package ca.mcgill.ecse211.project;

import static org.mockito.Mockito.*;
import org.mockito.stubbing.*;

import lejos.hardware.ev3.LocalEV3;
import lejos.hardware.lcd.TextLCD;
import lejos.hardware.motor.EV3LargeRegulatedMotor;
import lejos.hardware.port.SensorPort;
import lejos.hardware.sensor.EV3ColorSensor;

/**
 * This class is used to define static resources in one place for easy access and to avoid 
 * cluttering the rest of the codebase. All resources can be imported at once like this:
 * 
 * <p>{@code import static ca.mcgill.ecse211.lab3.Resources.*;}
 */
public class Resources {

  class FakeException extends RuntimeException {}
  static int leftTacho = 0;
  static int rightTacho = 0;
  
  
  /**
   * The wheel radius in centimeters.
   */
  public static final double WHEEL_RAD = 2.130;
  
  /**
   * The robot width in centimeters.
   */
  public static final double TRACK = 15;
  
  /**
   * The speed at which the robot moves forward in degrees per second.
   */
  public static final int FORWARD_SPEED = 250;
  
  /**
   * The speed at which the robot rotates in degrees per second.
   */
  public static final int ROTATE_SPEED = 150;
  
  /**
   * The motor acceleration in degrees per second squared.
   */
  public static final int ACCELERATION = 3000;
  
  /**
   * Timeout period in milliseconds.
   */
  public static final int TIMEOUT_PERIOD = 3000;
  
  /**
   * The tile size in centimeters.
   */
  public static final double TILE_SIZE = 30.48;
  
  /**
   * The left motor.
   */
  public static final EV3LargeRegulatedMotor leftMotor = mock(EV3LargeRegulatedMotor.class);
  {
    when(leftMotor.getTachoCount()).thenAnswer((Answer<?>) inv -> { return leftTacho; });
    doThrow(FakeException.class).when(leftMotor).forward();
  };

  /**
   * The right motor.
   */
  public static final EV3LargeRegulatedMotor rightMotor = mock(EV3LargeRegulatedMotor.class);
  {
    when(rightMotor.getTachoCount()).thenAnswer((Answer<?>) inv -> { return rightTacho; });
    doThrow(FakeException.class).when(rightMotor).forward();
  };
  
  /**
   * The color sensor.
   */
  public static final EV3ColorSensor colorSensor = mock(EV3ColorSensor.class);

  /**
   * The LCD.
   */
  public static final TextLCD LCD = mock(TextLCD.class);
  
  /**
   * The odometer.
   */
  public static Odometer odometer = Odometer.getOdometer();
  
}
 
;